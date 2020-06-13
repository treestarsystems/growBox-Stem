var pathname = window.location.pathname.slice(1);
var applyButton = document.getElementById('applyButton');
var input = document.getElementById('configInput');

if (pathname == 'setup') {
 //Disable apply button until back-end returns result.
 applyButton.onclick = null;
 input.disabled = true;
 applyButton.disabled = true;
/*
 console.log('Redirecting.....')
 document.title = "Redirecting.....";
 window.location = "/login";
*/

//Used to simulate retrieval of config status of 'no'
 setTimeout(function(){
  Swal.fire({
   icon: 'info',
   title: 'No Config Found!',
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
 }, 3000);
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
   title: 'Config Applied!',
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
