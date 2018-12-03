
Vue.component('home-page', {
    template: '#home',
    props:[],
    data: function(){
        return {
        }
    },
    methods: {
        switchToParent(){
            app.currentpage = 111;
        },
        switchToChild() {
            app.currentpage = 21;
        }
    },
    created: function(){
    },
    destroyed: function(){
    }
    });


Vue.component('parent-sign-in-page', {
    template: '#parent-sign-in',
    props:["currentpage"],
    data: function(){
        return {
            newEmail:"john.doe@student.ju.se",
            newPassword:"password"
        }
    },
    methods: {
        goToSignUp:function(){
            app.currentpage=112;
        },
        signIn : function(){
            firebase.auth().signInWithEmailAndPassword(this.newEmail,this.newPassword).then(
                function(userCredentials){
                    // Successfully signed in.
                    const user = userCredentials.user
                    db.collection("users").add({
                        mail:user.email,
                        name : user.displayName,
                        userId : user.uid,
                        sons : []
                    })
                    alert("Welcome "+user.displayName)
                    app.currentpage = 12;
                }).catch( function (error){
                    console.log(error.message)
                    console.log(error.code)
                    alert("error while trying to sign up.\n("+error.message+")\nPlease try again")

                })
        }
    },
    created: function(){
    },
    destroyed: function(){
    }
    });

Vue.component('parent-sign-up-page', {
    template: '#parent-sign-up',
    props:["currentpage"],
    data: function(){
        return {
            username:"John Doe",
            newEmail:"john.doe@student.ju.se",
            newPassword:"password"
        }
    },
    methods: {
        signUp : function(){
            firebase.auth().createUserWithEmailAndPassword(this.newEmail,this.newPassword).then(
                function(userCredentials){
                    const user = userCredentials.user 
                    user.updateProfile({
                        displayName : this.username
                    }).then(function() {
                        db.collection("users").add({
                            mail:user.email,
                            name : user.displayName,
                            userId : user.uid,
                            sons : []
                        })
                        alert("Welcome "+user.displayName)
                    }).catch(function(error){
                        console.log(error)
                    })      
                    
                    app.currentpage = 12;
                    app.headerName = this.username
                }.bind(this)
            ).catch(function (error){

                alert("error while trying to sign up.\n("+error.message+")\nPlease try again")
            })
        },
        goToSignIn:function(){
            app.currentpage=111;
        }
    },
    created: function(){
    },
    destroyed: function(){
    }
    });




Vue.component('parent-list-page', {
    template: '#parent-list',
    data: function(){
        return { 
            children:[],
            unsuscribe : ()=>{}
        }
    },
    methods: {
        seeSon:function(son){
            app.temporarySon=son;
            app.headerName=son.name;
            app.currentpage=13;
        }
    },
    created: function(){
        const user = firebase.auth().currentUser

        const colRef = db.collection("users").where("userId","==",user.uid)
        unsubscribe = colRef.onSnapshot(function(querySnapshot){  
            this.children=[];          
            const parentsfetched = querySnapshot.docs.map(function(parent){
                const parentfetched = parent.data();
                parentfetched.id=parent.id
                return parentfetched;
            })
            for(var i=0;i<parentsfetched.length;i++){
                for(var j=0;j<parentsfetched[i].sons.length;j++){
                    this.children.push(parentsfetched[i].sons[j])
                }
            }
            
        }.bind(this))

    },
    destroyed: function(){
            // Signed out!
            unsubscribe();
        
    }
    });




Vue.component('parent-child-info-page', {
    template: '#parent-child-info',
    data: function(){
        return { 
            position:[],
            onAlert:false,
            date:new Date,
        }
    },
    methods: {
        disconnect:function(){
            const user = firebase.auth().currentUser
            var colref = db.collection("users").where("userId","==",user.uid)
            colref.get().then((querySnapshot)=>{
                querySnapshot.forEach(function(documentSnapshot){
                    const id = documentSnapshot.id;
                    var parent=documentSnapshot.data()
                    for(var i=0;i<parent.sons.length;i++)
                    { 
                        if(parent.sons[i].name == app.temporarySon.name){
                            const toUpdate = db.collection("users").doc(id)
                            console.log(parent.sons.splice(i,2))
                            toUpdate.update({sons:parent.sons.splice(i,1)}).then(()=>{app.currentpage=12})
                            break;
                        }
                        
                    }
                })
                
            })
        }

    },
    created: function(){
        this.position=app.temporarySon.local;
        this.onAlert=app.temporarySon.onAlert;
    },
    destroyed: function(){
            // Signed out!
        
    }
    });




Vue.component('child-list-page', {
    template: '#child-list',
    data: function(){
        return { 
            parents:[],
            unsuscribe : ()=>{}
        }
    },
    methods: {
        seeParent:function(parent){
            app.temporaryParent=parent;
            app.headerName=parent.name;
            app.currentpage=22;
        }
    },
    created: function(){
        const colRef = db.collection("users")
        unsubscribe = colRef.onSnapshot(function(querySnapshot){  
            const parentsfetched = querySnapshot.docs.map(function(parent){
                const parentfetched = parent.data();
                parentfetched.id=parent.id
                return parentfetched;
            })
            this.parents=parentsfetched            
        }.bind(this))

    },
    destroyed: function(){
            // Signed out!
            unsubscribe();
        
    }
    });




Vue.component('child-log-in-page', {
    template: '#child-log-in',
    props:["currentpage"],
    data: function(){
        return {
            newEmail:"",
            newPassword:"password",
            username:"",
        }
    },
    methods: {
        connect : function(){
            firebase.auth().signInWithEmailAndPassword(this.newEmail,this.newPassword).then(
                function(userCredentials){
                    // Successfully signed in.
                    const user = userCredentials.user
                    db.collection("users").doc(app.temporaryParent.userId).update({
                        sons : sons.push({"name":this.username,"local":[1,0],"onAlert":false})                        
                    })
                    app.headerName=this.username
                    app.currentpage = 231;
                }).catch( function (error){
                    alert("error while trying to sign in.\n("+error.message+")\nPlease try again")
                })
        }.bind(this)
    },
    created: function(){
        this.newEmail=app.temporaryParent.email;
    },
    destroyed: function(){
    }
    });


        

const app = new Vue({
el: '#app',
data: function(){
    return {
        currentpage: 0,
        headerName :"Name",
        temporarySon : {},
        temporaryParent : {},
    }
},
methods: {
    contact(){
        alert("well, this is not very relevant for the test")
    },
    disconnect:function(){
        alert("this will disconnect all the devices");
        const user = firebase.auth().currentUser
        const query = db.collection("users").where("userId","==",user.uid)
        query.get().then(function(querySnapshot){
            querySnapshot.forEach(function(toDelete){
                var docRef = db.collection("users").doc(toDelete.id)
                docRef.delete()
            })
            }).catch(function(error){console.log(error)})
        firebase.auth().signOut().then(function(){
            app.currentpage=0;
        }).catch(function(error){console.log(error)})
    }.bind(this),
    alertParent(){
        alert("alert parent");
    }
},
created: function(){

},
destroyed: function(){
}
});