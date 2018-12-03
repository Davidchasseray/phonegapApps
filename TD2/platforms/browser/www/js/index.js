

Vue.component('home-page', {
    template: '#home',
    data: function(){
        return {
            counter: 0
        }
    },
    created: function(){
    },
    destroyed: function(){
    }
    });



Vue.component('opt1-page', {
    template: '#opt1',
    data: function(){
        return {
            count: 0
        }
    },
    created: function(){
    },
    destroyed: function(){
    }
    });

    Vue.component('opt3-page', {
        template: '#opt3',
        data: function(){
            return {
                id:0,
                date : ""
            }
        },
        created: function(){
            var updateDate = function (){
                var tempDate = new Date();
                this.date = tempDate.getFullYear() +"-"+tempDate.getMonth()+"-"+tempDate.getDate() + " " + tempDate.toLocaleTimeString();
            }.bind(this);
            this.id = setInterval( updateDate, 1000);

            },
        
        destroyed: function(){
            clearInterval(this.id)
        }
        });


        Vue.component('opt2-page', {
            template: '#opt2',
            data: function(){
                return {  
                    colors : ["Blue","Red","Green","Black"],
                    newColor :"White"
                }
            },
            methods: {
                addColor : function(colors,newColor){
                    colors.push(newColor);
                }.bind(this),
                remove : function(colors,color){
                    for(var i=0;i<colors.length ; i++){
                        if(colors[i]==color){
                            colors.splice(i, 1);
                            break;
                        }
                    }
                }.bind(this)
            },
            created: function(){
                newColor = document.getElementById("newColor").textContent
            },
            destroyed: function(){
            }
            });


Vue.component('battery-page', {
    template: '#battery',
    data: function(){
        return {
            batteryLevel: 0,
            isPlugged :false
        }
    },
    created: function(){
        const onBatteryStatus = function (status) {
            this.batteryLevel = status.level;
            this.isPlugged=status.isPlugged;
        }.bind(this);
        
        
        document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady() {
            window.addEventListener("batterystatus", onBatteryStatus, false);
        }
    },
    destroyed: function(){
        window.removeEventListener("batterystatus");
        document.removeEventListener("deviceready");
    }
    });


Vue.component('contacts-page', {
template: '#contacts',
data: function(){
    return {
        contacts: []
    }
},
created: function(){

    const onSuccess = function (contactList) {
        for (var i = 0; i < contactList.length; i++) {            
            this.contacts.push(contactList[i].displayName);
        }
        if(contactList.length==0)
        {
            alert("contacts empty");
        }
    }.bind(this);
     
    function onError(contactError) {
        alert('onError!');
    };
     
    //alert("try to fetch contacts please wait")
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        navigator.contacts.find(["displayName", "name"],onSuccess, onError);
    }
},
destroyed: function(){
    document.removeEventListener("deviceready");
}
});

Vue.component('location-page', {
    template: '#location',
    data: function(){
        return {
            latitude : 0,
            longitude :0
        }
    },
    created: function(){
        const onSuccess= function (position) {
            alert('Latitude: '          + position.coords.latitude          + '\n' +
                  'Longitude: '         + position.coords.longitude         + '\n');
            this.latitude=position.coords.latitude;
            this.longitude=position.coords.longitude;
        }.bind(this);
        
        function onError(error) {
            alert('code: '    + error.code    + '\n' +
                  'message: ' + error.message + '\n');
        };
        
        document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady() {
            alert("fetching position, please wait");
            navigator.geolocation.getCurrentPosition(onSuccess, onError); 
        };    
    },
    destroyed: function(){
        document.removeEventListener("deviceready");
    }
    });

const app = new Vue({
el: '#app',
data: function(){
    return {
        currentPage: 1
    }
}
})