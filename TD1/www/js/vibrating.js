
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    
    document.getElementById("vibrate").onclick = function(){
        var pauseSpeed = 2;
        var speed = 3;
        var song =[ 100*speed, 100*pauseSpeed, 150*speed, 100*pauseSpeed, 100*speed, 100*pauseSpeed,
            200*speed, 100*pauseSpeed, 200*speed, 100*pauseSpeed, 200*speed, 100*pauseSpeed, 200*speed, 100*pauseSpeed, 300*speed, 100*pauseSpeed,
            100*speed, 100*pauseSpeed, 150*speed, 100*pauseSpeed, 100*speed, 100*pauseSpeed, 150*speed, 100*pauseSpeed, 100*speed, 100*pauseSpeed,
            200*speed, 100*pauseSpeed, 400*speed, 100*pauseSpeed, 150*speed, 100*pauseSpeed, 100*speed, 400*pauseSpeed, 300*speed];
        navigator.vibrate(song);
    };
};
