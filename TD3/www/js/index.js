

Vue.component('signin-page', {
    template: '#signIn',
    props:["currentpage"],
    data: function(){
        return {
            newEmail:"john.doe@student.ju.se",
            newPassword:"password"
        }
    },
    methods: {
        signIn : function(){
            firebase.auth().signInWithEmailAndPassword(this.newEmail,this.newPassword).then(
                function(userCredentials){
                        // Successfully signed in.
                        const user = userCredentials.user
                        alert("Welcome "+user.displayName)
                        app.currentpage = 2;
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

    Vue.component('signup-page', {
        template: '#signUp',
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
                            alert("Welcome "+user.displayName)
                        }).catch(function(error){
                            console.log(error)
                        })      
                        
                        app.currentpage = 2;
                    }.bind(this)
                ).catch(function (error){

                    alert("error while trying to sign up.\n("+error.message+")\nPlease try again")
                })
            }
        },
        created: function(){
        },
        destroyed: function(){
        }
        });

Vue.component('chat-page', {
    template: '#chat',
    data: function(){
        return {
            newmessage : "",
            messages:[],
            unsuscribe : ()=>{}
        }
    },
    methods: {
       send:function(){
        const user = firebase.auth().currentUser
        if(this.newmessage!=""){
        db.collection("messages").add({
            date : new Date(),
            text : this.newmessage,
            userId : user.uid,
            username : user.displayName
        })
        this.newmessage="";
       }}
    },
    created: function(){
        const user = firebase.auth().currentUser

        const colRef = db.collection("messages").orderBy("date")
        unsubscribe = colRef.onSnapshot(function(querySnapshot){            
            const messagesfetched = querySnapshot.docs.map(function(message){
                const messagefetched = message.data();
                messagefetched.id=message.id
                if(messagefetched.userId==user.uid)
                {
                    messagefetched.username="You";
                    messagefetched.yourmessage=true;
                }
                else
                {
                    messagefetched.yourmessage=false;
                }
                return messagefetched;
            })
            this.messages = messagesfetched;
        }.bind(this))

    },
    destroyed: function(){
            // Signed out!
            unsubscribe();
        
    }
    });

    Vue.component('modify-page', {
        template: '#modifyChat',
        data: function(){
            return {
                previousmessage:""
                
            }
        },
        methods: {
           update:function(){
            var docRef = db.collection("messages").doc(app.temporaryMessageId)
            docRef.update({text:this.previousmessage})            
            app.currentpage = 2;

        }
    },
        created: function(){
            var docRef = db.collection("messages").doc(app.temporaryMessageId)
            docRef.get().then((object)=>{this.previousmessage= object.data().text})


        },
        destroyed: function(){
            
        }
    
    });
    Vue.component('card-page', {
        template: '#messageCard',
        data: function(){
            return {
            }
        },
        props:["message"],
        methods: {
            deleteMessage : function(){
                var docRef = db.collection("messages").doc(this.message.id)
                docRef.delete()
           },
           updateMessage : function(){               
            app.temporaryMessageId=this.message.id;
            app.currentpage = 3;
           }
        },
        created: function(){
            
        },
        destroyed: function(){
            
        },
        
        });

    Vue.component('chatheader-page', {
        template: '#chatheader',
        data: function(){
            return {
            }
        },
        methods: {
           deleteProfile : function(){
                const user = firebase.auth().currentUser
                const query = db.collection("messages").where("userId","==",user.uid)
                query.get().then(function(querySnapshot){
                    querySnapshot.forEach(function(toDelete){
                        var docRef = db.collection("messages").doc(toDelete.id)
                        docRef.delete()
                    })
                    }).then(alert("Messages deleted")).catch(function(error){console.log(error)}).then(()=>{                    
                        user.delete().then(function(){
                           alert("User Deleted");
                           app.currentpage = 1;
                       })
                    }).catch(function(error){console.log(error)})
            }.bind(this)
        },
        created: function(){
        },
        destroyed: function(){
            firebase.auth().signOut().then(function(){
                alert("Logged out")
            })
        }
        });


        

const app = new Vue({
el: '#app',
data: function(){
    return {
        currentpage: 0,
        temporaryMessageId:""
    }
}
})