/*
For GrowBox-Stem (Environment Controller)
Purpose - A collection of relay control functions
Inputs  -
Action  -
*/

const Gpio = require('onoff').Gpio;

//0 = On|Low /1 = Off|High
//Please enter a valid GPIO pin number - <GPIO.BMC> number
//Please enter a valid Task - on|off
function relayControl (pin, task) {
 var invalidGpio = {
  "status": "failure",
  "message": "Please enter a valid GPIO pin number - <GPIO.BMC> number"
 };
 var invalidTask = {
  "status": "failure",
  "message": "Please enter a valid Task - on|off"
 };
 var validRequest = {
  "status": "success",
  "message": "Completed"
 };
 var executionError = {
  "status": "failure",
  "message": "Execution Error. Unable to complete task."
 };

 if ((Number.isInteger(pin)) && (pin)) {
  if ((task) && (task.match(/^on$|^off$/g))) {
   const relay = new Gpio(pin, 'out');
   if (task == 'on') {
    relay.write(0,err => {
     if (err) {
      return executionError;
     }
    });
    return validRequest;
   } else if (task == 'off') {
    relay.write(1,err => {
     if (err) {
      return executionError;
     }
     relay.unexport();
    });
    return validRequest;
   }
  } else {
   return invalidTask;
  }
 } else {
  return invalidGpio;
 }
}

//Test execution string
/*
relayControl (5, 'off');
*/

module.exports = {
 relayControl
}
