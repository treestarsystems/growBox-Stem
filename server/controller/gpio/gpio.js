/*
For GrowBox-Stem (Environment Controller)
Purpose - Read/Write from/to GPIO pin
Inputs  -
Action  -
*/

const express = require('express');
const router = express.Router();
const core = require('../../../modules/core.js');
const observium = require('../../observium/fetchObservium.js');
const Gpio = require('onoff').Gpio;

//0 = On|Low|Float near wires /1 = Off|High|Float away from  wires
function readGpio (pin) {
 var invalidGpio = {
  "status": {
   "code": "500",
   "codeType": "error",
   "message": "Please enter a valid GPIO pin number - <GPIO.BMC> number"
  }
 };
 if ((Number.isInteger(pin)) && (pin)) {
  const gpio = new Gpio(pin, 'out');
  const result = () => {
   gpio.read()
    .then(function (value) {
     return value;
    })
   .catch(err => console.log);
  };

 var validRequest = {
  "status": {
   "code": "200",
   "codeType": "success",
   "message": "Completed",
   "reading": result()
  }
 };
 console.log(validRequest);
  return validRequest;
 } else {
  return invalidGpio;
 }
}

function writeGpio (pin,value) {
 var invalidGpio = {
  "status": {
   "code": "500",
   "codeType": "error",
   "message": "Please enter a valid GPIO pin number - <GPIO.BMC> number"
  }
 };
 if ((Number.isInteger(pin)) && (pin)) {
  const gpio = new Gpio(pin, 'out');
  gpio.writeSync(value)
  var validRequest = {
   "status": {
    "code": "200",
    "codeType": "success",
    "message": "Completed"
   }
  };
  return validRequest;
 } else {
  return invalidGpio;
 }
}

//Test execution. Must readd console.log lines before return values.
/*
writeGpio(5,1);
readGpio(5);
*/

module.exports = {
 readGpio,
 writeGpio
}
