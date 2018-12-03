
function onSuccess(contacts) {
    for (var i = 0; i < contacts.length; i++) {
        //alert(contacts[i].displayName);
        contact = document.createElement("li");
        contact.id="contact";
        contact.innerHTML=contacts[i].displayName;
        contact.class="vcenter fill";
        document.getElementById('contacts').appendChild(contact);
    }
    if(contacts.length==0)
    {
        alert("contacts empty");
    }
};
 
function onError(contactError) {
    alert('onError!');
};
 
//alert("try to fetch contacts please wait")
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    navigator.contacts.find(["displayName", "name"],onSuccess, onError);
}
