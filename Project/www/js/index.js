


Vue.component('sign-in-page', {
    template: '#sign-in',
    props: ["currentpage"],
    data: function () {
        return {
            newEmail: "john.doe@student.ju.se",
            newPassword: "password"
        }
    },
    methods: {
        goToSignUp: function () {
            app.currentpage = 1;
        },
        signIn: function () {
            firebase.auth().signInWithEmailAndPassword(this.newEmail, this.newPassword).then(
                function (userCredentials) {
                    // Successfully signed in.
                    const user = userCredentials.user
                    alert("Welcome " + user.displayName)
                    const docRef = db.collection("users").doc(user.uid)
                    docRef.get().then(function (doc) {
                        app.user = doc.data()
                        if (app.user.isChild) {
                            app.currentpage = 3;
                        }
                        else {
                            app.currentpage = 2;
                        }
                    }).catch(function(error){
                        alert(app.user.isChild)
                    });
                }).catch(function (error) {
                    console.log(error.message)
                    console.log(error.code)
                    alert("error while trying to sign up.\n(" + error.message + ")\nPlease try again")

                })
        }
    },
    created: function () {
    },
    destroyed: function () {
    }
});

Vue.component('parent-sign-up-page', {
    template: '#parent-sign-up',
    props: ["currentpage"],
    data: function () {
        return {
            username: "John Doe",
            newEmail: "john.doe@student.ju.se",
            newPassword: "password"
        }
    },
    methods: {
        signUp: function () {
            firebase.auth().createUserWithEmailAndPassword(this.newEmail, this.newPassword).then(
                function (userCredentials) {
                    const user = userCredentials.user
                    user.updateProfile({
                        displayName: this.username
                    }).then(function () {
                        app.user = {
                            email: user.email,
                            pwd: this.newPassword,
                            name: user.displayName,
                            uid: user.uid,
                            isChild: false,
                            /*children: []*/
                        }
                        db.collection("users").doc(user.uid).set(app.user)
                        alert("Welcome " + user.displayName)
                    }.bind(this)).catch(function (error) {
                        console.log(error)
                    })


                    app.currentpage = 2;

                }.bind(this)
            ).catch(function (error) {

                alert("error while trying to sign up.\n(" + error.message + ")\nPlease try again")
            })
        },
        goToSignIn: function () {
            app.currentpage = 0;
        }
    },
    created: function () {
    },
    destroyed: function () {
    }
});




Vue.component('parent-list-page', {
    template: '#parent-list',
    props: ["currentpage"],

    data: function () {
        return {
            children: [],
            unsuscribe: () => { }
        }
    },
    methods: {
        seeChild: function (child) {
            app.temporaryChild = child;
            app.currentpage = 4;
        },
        signUp: function () {
            app.currentpage = 5;
        }
    },
    created: function () {
        const user = app.user;
        const colRef = db.collection("users").where("isChild", "==", true).where("parentId", "==", user.uid)
        unsubscribe = colRef.onSnapshot(function (querySnapshot) {
            this.children = []
            const childrenfetched = querySnapshot.docs.map(function (child) {
                const childfetched = child.data();
                childfetched.id = child.id
                return childfetched;
            })
            for (var i = 0; i < childrenfetched.length; i++) {
                this.children.push(childrenfetched[i])
            }

        }.bind(this))

    },
    destroyed: function () {
        // Signed out!
        unsubscribe();

    }
});




Vue.component('parent-child-info-page', {
    template: '#parent-child-info',
    props: ["currentpage"],
    data: function () {
        return {
            onAlert: false,
            name: "",
        }
    },
    methods: {
        disconnect: function () {
            db.collection("users").doc(app.temporaryChild.uid).update({ "parentId": "" }).then(() => { app.currentpage = 2 })
        },
        goBack: function () {
            app.currentpage = 2
        }
    },
    created: function () {
        this.name = app.temporaryChild.name;
        this.onAlert = app.temporaryChild.onAlert;
    },
    destroyed: function () {
        // Signed out!

    }
});


Vue.component('child-page', {
    template: '#child',
    props: ["currentpage"],
    data: function () {
        return {
            onAlert: false,
            connected: true,
            unsuscribe: () => { },
        }
    },
    methods: {
        alert: function () {
                db.collection("users").doc(app.user.uid).update({ "onAlert": !this.onAlert })
        }
           
                

    },
    created: function () {
        const user = firebase.auth().currentUser
        const docRef = db.collection("users").doc(user.uid)
        unsubscribe = docRef.onSnapshot(function (child) {
            
            this.onAlert = child.data().onAlert;
            if (child.data().parentId == "") {
                this.connected = false;
            }
            else {
                this.connected = true;
            }

        }.bind(this))

    },
    destroyed: function () {
        unsubscribe()
    }
});









Vue.component('child-sign-up-page', {
    template: '#child-sign-up',
    props: ["currentpage"],
    data: function () {
        return {
            newEmail: "jane.doe@student.ju.se",
            newPassword: "password",
            username: "Jane Doe",
        }
    },
    methods: {
        signUp: function () {
            firebase.auth().createUserWithEmailAndPassword(this.newEmail, this.newPassword).then(
                function (userCredentials) {
                    const user = userCredentials.user
                    user.updateProfile({ displayName: this.username }).then(function () {
                        db.collection("users").doc(user.uid).set({
                            isChild: true,
                            email: user.email,
                            name: user.displayName,
                            uid: user.uid,
                            parentId: app.user.uid,
                            onAlert: false
                        }).then(() => {
                            firebase.auth().signOut().then(function () {
                                    app.currentpage = 2;
                            })
                        })

                    }).catch(function (error) {
                        console.log(error)
                    })

                }.bind(this)
            ).catch(function (error) {
                alert("error while trying to sign up.\n(" + error.message + ")\nPlease try again")
            })
        },
        connectExistant: function () {
            firebase.auth().signInWithEmailAndPassword(this.newEmail, this.newPassword).then(
                function (userCredentials) {
                    const user = userCredentials.user
                    db.collection("users").doc(user.uid)
                        .update({ "parentId": app.user.uid }).catch(()=>{alert("non existing child")})
                        .then(function () { console.log("ok") }).then(() => {
                            app.currentpage = 2;
                        
                    
                })
                        
                }
            ).catch(function (error) {

                alert("error while trying to sign in.\n(" + error.message + ")\nPlease try again")
            })
        },

        goBackToParent: function () {
            app.currentpage = 2;
        }
    },
    created: function () {
    },
    destroyed: function () {
        firebase.auth().signInWithEmailAndPassword(app.user.email, app.user.pwd)
    }
});




const app = new Vue({
    el: '#app',
    data: function () {
        return {
            currentpage: 0,
            user: "",
            temporaryChild: null,
        }
    },
    methods: {


    },
    created: function () {

    },
    destroyed: function () {
    }
});