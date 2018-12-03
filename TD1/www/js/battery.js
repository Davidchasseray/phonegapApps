
function onBatteryStatus(status) {
    document.getElementById('batteryLevel').innerHTML=status.level+" %";
    document.getElementById('plugged').innerHTML=status.isPlugged;
};


document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    window.addEventListener("batterystatus", onBatteryStatus, false);
}

