const xAcc = [];
const yAcc = [];
const zAcc = [];
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    navigator.accelerometer.watchAcceleration(onSuccess, onError, options);
}
function onSuccess(acceleration) {
    
    xAcc.push({x:acceleration.timestamp,y:acceleration.x})
    yAcc.push({x:acceleration.timestamp,y:acceleration.y})
    zAcc.push({x:acceleration.timestamp,y:acceleration.z})
    showGraph(xAcc,yAcc,zAcc);
}
function onError() {
    alert('onError!');
}
var options = { frequency: 3000 };  // Update every 3 seconds



function showGraph (xAcc,yAcc,zAcc) {
    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        title:{
            text: "Gyroscope data"
        },
        axisX: {
            title: "Timestamp",
        },
        axisY: {
            title: "Acceleration",
            includeZero: false,
            suffix: " m.s^2"
        },
        legend:{
            cursor: "pointer",
            fontSize: 16,
            itemclick: toggleDataSeries
        },
        toolTip:{
            shared: true
        },
        data: [{
            name: "X acceleration",
            type: "spline",
            showInLegend: true,
            dataPoints: this.xAcc
        },
        {
            name: "Y acceleration",
            type: "spline",
            showInLegend: true,
            dataPoints: this.yAcc
        },
        {
            name: "Z acceleration",
            type: "spline",
            showInLegend: true,
            dataPoints: this.zAcc
        }]
    });
    chart.render();

    function toggleDataSeries(e){
        if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        }
        else{
            e.dataSeries.visible = true;
        }
        chart.render();
    }

}