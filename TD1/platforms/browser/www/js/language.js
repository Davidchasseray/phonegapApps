document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    navigator.globalization.getPreferredLanguage(
        function (language) {
            document.getElementById("language").textContent = language.value;
        ;},
        function () {alert('Error getting language\n');}
        );
    navigator.globalization.getDateNames(
        function (names) {for (var i = 0; i < names.value.length; i++) {
            document.getElementById("languageExample").textContent += names.value[i] + '\n';
        }},
        function () {alert('Error getting locale\n');}
    );

};