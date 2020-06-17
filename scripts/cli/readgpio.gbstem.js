#!/usr/bin/env node
//For GrowBox-Stem (Environment Controller)
const Gpio = require('onoff').Gpio;
var argv = require('minimist')(process.argv.slice(2));

//0 = On|Low|Float near wires /1 = Off|High|Float away from  wires
if ((Number.isInteger(argv.gpio)) && (argv.gpio)) {
 const readgpio = new Gpio(argv.gpio, 'out');
 while (true) {
  console.log(readgpio.readSync());
 }
} else {
 console.log('Please enter a valid --gpio <GPIO.BMC> number');
}

