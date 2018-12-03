

function onSuccess(position) {
    alert('Latitude: '          + position.coords.latitude          + '\n' +
          'Longitude: '         + position.coords.longitude         + '\n');
    document.getElementById('latitude').innerHTML=position.coords.latitude;
    document.getElementById('longitude').innerHTML=position.coords.longitude;
};

function onError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
};

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    alert("fetching position, please wait");
    navigator.geolocation.getCurrentPosition(onSuccess, onError); 
};





