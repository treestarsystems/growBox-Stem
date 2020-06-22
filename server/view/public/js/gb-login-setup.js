var previousPage = document.referrer.split('/')[3]; //Yes it is static but it is good for now.
var pathname = window.location.pathname.slice(1);
var applyButton = document.getElementById('applyButton');
var input = document.getElementById('configInput');
var currentInterfacePassword = '';

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
   unlock();
  } else {
   console.log(response.message);
   if (previousPage != 'login') {
    Swal.fire({
     icon: 'error',
     title: 'Invalid Response/Configuration &#129335;&#127998;',
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
 let config = JSON.parse(input.value);
 delete config.message;
 config['currentInterfacePassword'] = currentInterfacePassword;
 if (isJson(input.value) && input.value != '{}') {
  let url = `/api/configure`;
  var xhr = new XMLHttpRequest();
  xhr.open('POST', url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.responseType = 'json';
  xhr.send(JSON.stringify(config));
  xhr.onload = function() {
   var response = xhr.response;
   if (response.message == 'yes') {
    Swal.fire({
     icon: 'success',
     title: 'Config Applied! &#128175;',
     toast: true,
     showConfirmButton: false,
     position: 'top-end',
     timerProgressBar: true,
     timer: 2000
    });
    setTimeout(function(){
     console.log('Redirecting.....')
     document.title = "Redirecting.....";
     window.location = "/";
    }, 2150);
   } else {
    Swal.fire({
     icon: 'error',
     title: `${response.message} `,
     toast: true,
     showConfirmButton: false,
     position: 'top-end',
     timerProgressBar: true,
     timer: 2000
    });
    setTimeout(function(){
     console.log('Redirecting.....')
     document.title = "Redirecting.....";
     window.location = response.link || "/";
    }, 2150);
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

function unlock () {
 Swal.fire({
  title: 'Config Password?',
  input: 'password',
  allowOutsideClick: false,
  preConfirm: (password) => {
   currentInterfacePassword = password;
   checkAuth(password);
  }
 });
}

function checkAuth (password) {
 let request = JSON.stringify({"password": password});
 let url = `/api/auth`;
 var xhr = new XMLHttpRequest();
 xhr.open('POST', url, true);
 xhr.setRequestHeader("Content-Type", "application/json");
 xhr.responseType = 'json';
 xhr.send(request);
 xhr.onload = function() {
  var response = xhr.response;
  if (response.message == 'yes') {
   Swal.fire({
    icon: 'success',
    title: 'Config Unlocked! &#128275;',
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
  } else {
   location.reload();
  }
 }
}
