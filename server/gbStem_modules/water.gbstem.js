/*
For GrowBox-Stem (Environment Controller)
Purpose - A collection of water control functions
Inputs  -
Action  -
*/

const Gpio = require('onoff').Gpio;

//For waterflow monitoring
var rateCount = 0;
var totalCount = 0;
var minutes = 0;
var constant = 0.10;
var startTime = (Date.now()/1000).toFixed();
var now = 0;
var interval = 60;

function monitorWaterFlow(pin) {
	now = (Date.now()/1000).toFixed();
	interval = 60;
	const flowSensor = new Gpio(pin, 'in', 'falling');
	var waterFlowReading = `{"constant": ${constant}, "startTime": ${startTime}, "now": ${now}, "rateCount": ${rateCount}, "totalCount": ${totalCount}, "flowRate": ${(rateCount * constant).toFixed(2)}, "revolutions": ${(rateCount * constant).toFixed(2)}, "time": ${(now - startTime)/interval}}`;
	flowSensor.watch((err, value) => {
		if (err) {
			throw err;
		}
		rateCount++;
		totalCount++;
	});
	return waterFlowReading;
}

module.exports = {
	monitorWaterFlow
}
