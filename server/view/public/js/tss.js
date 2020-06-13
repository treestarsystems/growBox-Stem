var pathname = window.location.pathname.slice(1);
var applyButton = document.getElementById('applyButton');
var input = document.getElementById('configInput');

if (pathname == 'setup') {
 //Disable apply button until back-end returns result.
 applyButton.onclick = null;
 input.disabled = true;
 applyButton.disabled = true;

 //Check with backend if the device is configured.
 let url = `/api/configure`;
 var xhr = new XMLHttpRequest();
 xhr.open('GET', url, true);
 xhr.setRequestHeader("Content-Type", "application/json");
 xhr.responseType = 'json';
 xhr.send();
 xhr.onload = function() {
  let response = xhr.response;
  if (response.message == "no") {
   Swal.fire({
    icon: 'info',
    title: 'No Config Found! &#10068;',
    toast: true,
    showConfirmButton: false,
    position: 'top-end',
    timerProgressBar: true,
    timer: 2000
   });
   input.disabled = false;
   //It seems you have to reverse the diable then enable it. Weird. Maybe research this.
   applyButton.disabled = false;
   applyButton.enabled = true;
   applyButton.onclick = function (){applyConfig()};
  } else if (response.message == "yes") {
   Swal.fire({
    icon: 'success',
    title: 'Redirecting....&#128175;',
    toast: true,
    showConfirmButton: false,
    position: 'top-end',
    timerProgressBar: true,
    timer: 2000
   });
   setTimeout(function(){
    console.log('Configuration exists. Redirecting.....')
    document.title = "Redirecting.....";
    window.location = "/login";
   }, 2150);
  } else {
   Swal.fire({
    icon: 'error',
    title: 'Invalid Response/Configuration &#129335;&#127998;',
    toast: true,
    showConfirmButton: false,
    position: 'top-end',
    timerProgressBar: true,
    timer: 2000
   });
   input.disabled = false;
   //It seems you have to reverse the diable then enable it. Weird. Maybe research this.
   applyButton.disabled = false;
   applyButton.enabled = true;
   applyButton.onclick = function (){applyConfig()};
  }
 }
}

function isJson(str) {
 try {
  JSON.parse(str);
 } catch (e) {
  return false;
 }
 return true;
}

function applyConfig () {
 //After XHR
 if (isJson(input.value)) {
  Swal.fire({
   icon: 'success',
   title: '&#128175; Config Applied!',
   toast: true,
   showConfirmButton: false,
   position: 'top-end',
   timerProgressBar: true,
   timer: 2000
  });
  setTimeout(function(){
   console.log('Redirecting.....')
   document.title = "Redirecting.....";
   window.location = "/login";
  }, 2150);
 } else {
  Swal.fire({
   icon: 'error',
   title: 'Invalid Config!',
   toast: true,
   showConfirmButton: false,
   position: 'top-end',
   timerProgressBar: true,
   timer: 2000
  });
 }
}