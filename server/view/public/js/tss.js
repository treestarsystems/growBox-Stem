
var previousPage = document.referrer.split('/')[3]; //Yes it is static but it is good for now.
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
  //This is if statement isnt needed I just was annoyed that it showuld the alert twice on two different pages.
  if (response.message == "no") {
   if (previousPage != 'login') {
    Swal.fire({
     icon: 'info',
     title: 'No Config Found! &#10068;',
     toast: true,
     showConfirmButton: false,
     position: 'top-end',
     timerProgressBar: true,
     timer: 2000
    });
   }
   input.disabled = false;
   //It seems you have to reverse the diable then enable it. Weird. Maybe research this.
   applyButton.disabled = false;
   applyButton.enabled = true;
   applyButton.onclick = function (){applyConfig()};
  } else if (response.message == "yes") {
   Swal.fire({
    icon: 'success',
    title: '&#128175; Redirecting....',
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
    title: '&#129335;&#127998; Invalid Response/Configuration',
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

if (pathname == 'login') {
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
    title: 'No Config Found! Redirecting...&#10068;',
    toast: true,
    showConfirmButton: false,
    position: 'top-end',
    timerProgressBar: true,
    timer: 2000
   });
   setTimeout(function(){
    console.log('No configuration exists. Redirecting.....')
    document.title = "Redirecting.....";
    window.location = "/setup";
   }, 2150);
  } else if (response.message == "yes") {
   console.log('A configuration exists.')
  } else {
   Swal.fire({
    icon: 'error',
    title: '&#129335;&#127998; Invalid Response/Configuration',
    toast: true,
    showConfirmButton: false,
    position: 'top-end',
    timerProgressBar: true,
    timer: 2000
   });
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
 if (isJson(input.value)) {
  let url = `/api/configure`;
  var xhr = new XMLHttpRequest();
  xhr.open('POST', url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.responseType = 'json';
  xhr.send(input.value);
  xhr.onload = function() {
   let response = xhr.response;
   if (response.message == 'yes') {
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
     title: '&#10060; Error Writing Config!',
     toast: true,
     showConfirmButton: false,
     position: 'top-end',
     timerProgressBar: true,
     timer: 2000
    });
   }
  }
 } else {
  Swal.fire({
   icon: 'error',
   title: 'Invalid Config! &#128561;',
   toast: true,
   showConfirmButton: false,
   position: 'top-end',
   timerProgressBar: true,
   timer: 2000
  });
 }
}
