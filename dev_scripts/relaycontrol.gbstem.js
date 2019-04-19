#!/usr/bin/env node
//For GrowBox-Stem (Environment Controller)
var argv = require('minimist')(process.argv.slice(2));
const Gpio = require('onoff').Gpio;
const relay = new Gpio(argv.gpio, 'out');

//Turning the realy on and off.
//0 = On|Low /1 = Off|High
if (argv.task == 'on') {
	relay.writeSync(0);
} else if (argv.task == 'off') {
	relay.writeSync(1);
} else {
	relay.unexport();
}
