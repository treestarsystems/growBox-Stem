#!/usr/bin/env node
/*
For GrowBox-Stem (Environment Controller)
Purpose - CLI script to monitor water flow
Inputs  -
Action  -
*/

const water = require('../water.gbstem.js');
var argv = require('minimist')(process.argv.slice(2));
var waterFlowReading = '';

//0 = On|Low|Float near wires /1 = Off|High|Float away from  wires
if ((Number.isInteger(argv.gpio)) && (argv.gpio)) {
	water.monitorWaterFlow(argv.gpio,'off');
} else {
        console.log('Please enter a valid --gpio <GPIO.BMC> number');
}
