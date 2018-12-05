


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
                        app.currentpage = 2;

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
        seeSon: function (son) {
            app.temporarySon = son;
            app.currentpage = 4;
        },
        signUp: function () {
            app.currentpage = 5;
        }
    },
    created: function () {
        const user = firebase.auth().currentUser
        const colRef = db.collection("users").where("isChild", "==", true).where("parentId", "==", user.uid)
        unsubscribe = colRef.onSnapshot(function (querySnapshot) {
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
            position: [],
            onAlert: false,
            date: new Date,
        }
    },
    methods: {
        disconnect: function () {
            const user = firebase.auth().currentUser
            var colref = db.collection("users").where("userId", "==", user.uid)
            colref.get().then((querySnapshot) => {
                querySnapshot.forEach(function (documentSnapshot) {
                    const id = documentSnapshot.id;
                    var parent = documentSnapshot.data()
                    for (var i = 0; i < parent.sons.length; i++) {
                        if (parent.sons[i].name == app.temporarySon.name) {
                            const toUpdate = db.collection("users").doc(id)
                            console.log(parent.sons.splice(i, 2))
                            toUpdate.update({ sons: parent.sons.splice(i, 1) }).then(() => { app.currentpage = 12 })
                            break;
                        }

                    }
                })

            })
        }

    },
    created: function () {
        this.position = app.temporarySon.local;
        this.onAlert = app.temporarySon.onAlert;
    },
    destroyed: function () {
        // Signed out!

    }
});









Vue.component('child-sign-up-page', {
    template: '#child-sign-up',
    props: ["currentpage"],
    data: function () {
        return {
            newEmail: "child.test@ghu.se",
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
                        })/*.then(() => {
                            if (app.user.children.includes(user.uid) == false) {
                                app.user.children.push(user.uid)
                            }
                            const toUpdate = db.collection("users").doc(app.user.uid)
                            toUpdate.update({ children: app.user.children })
                        })*/

                    }).catch(function (error) {
                        console.log(error)
                    })

                }.bind(this)
            ).then(() => {
                firebase.auth().signOut().then(function () {
                    firebase.auth().signInWithEmailAndPassword(app.user.email, app.user.pwd).then(() => {
                        app.currentpage = 2;
                    })
                })
            }).catch(function (error) {
                alert("error while trying to sign up.\n(" + error.message + ")\nPlease try again")
            })
        },
        connectExistant: function () {
            firebase.auth().signInWithEmailAndPassword(this.newEmail, this.newPassword).then(
                function (userCredentials) {
                    const user = userCredentials.user

                    const docref = db.collection("users").doc(user.uid);
                    docref.update({ parentId: app.user.uid }).then(function () {
                        console.log("ok");
                    }).catch((error) => { console.log(error); })

                    alert(user.uid)
                    alert(app.user.uid)


                    /*
                    if (app.user.children.includes(user.uid) == false) {
                        app.user.children.push(user.uid)
                    }
                    const toUpdate = db.collection("users").doc(app.user.uid)
                    toUpdate.update({ children: app.user.children })*/
                }
            ).then(() => {
                firebase.auth().signOut().then(function () {
                    firebase.auth().signInWithEmailAndPassword(app.user.email, app.user.pwd).then(() => {
                        app.currentpage = 2;
                    })
                })
            }).catch(function (error) {

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
    }
});




const app = new Vue({
    el: '#app',
    data: function () {
        return {
            currentpage: 0,
            user: "",
            temporarySon: null,
        }
    },
    methods: {

        disconnect: function () {
            alert("this will disconnect all the devices");
            const user = firebase.auth().currentUser
            const query = db.collection("users").where("uid", "==", user.uid)
            query.get().then(function (querySnapshot) {
                querySnapshot.forEach(function (toDelete) {
                    var docRef = db.collection("users").doc(toDelete.id)
                    docRef.delete()
                })
            }).catch(function (error) { console.log(error) })
            firebase.auth().signOut().then(function () {
                app.currentpage = 0;
            }).catch(function (error) { console.log(error) })
        }.bind(this),
        alertParent() {
            alert("alert parent");
        }
    },
    created: function () {

    },
    destroyed: function () {
    }
});