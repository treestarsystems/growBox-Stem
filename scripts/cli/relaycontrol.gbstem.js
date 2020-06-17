#!/usr/bin/env node
//For GrowBox-Stem (Environment Controller)
const Gpio = require('onoff').Gpio;
var argv = require('minimist')(process.argv.slice(2));

//Turning the realy on and off.

//0 = On|Low /1 = Off|High
if ((Number.isInteger(argv.gpio)) && (argv.gpio)) {
 if (((argv.task == 'on') || (argv.task == 'off')) && (argv.task)) {
  const relay = new Gpio(argv.gpio, 'out');
  if (argv.task == 'on') {
   relay.writeSync(0);
  } else if (argv.task == 'off') {
   relay.writeSync(1);
   relay.unexport();
  } else {
   relay.unexport();
  }
 } else {
  console.log('Please enter a valid --task on|off');
 }
} else {
 console.log('Please enter a valid --gpio <GPIO.BMC> number');
}
