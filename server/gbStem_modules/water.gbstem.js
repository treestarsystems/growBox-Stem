/*
For GrowBox-Stem (Environment Controller)
Purpose - A collection of water control functions
Inputs  -
Action  -
ALMOST READY FOR USE
*/

const Gpio = require('onoff').Gpio;

//For waterflow monitoring
var rateCount = 0;
var totalCount = 0;
var constant = 0.10;
var startTime = (Date.now()/1000).toFixed();
var now = 0;
var interval = 60;
minute = 0;
var waterFlowReading = '';

function monitorWaterFlow(pin) {
	const flowSensor = new Gpio(pin, 'in', 'falling');
	flowSensor.watch((err, value) => {
		if (err) {
			throw err;
		}
		rateCount++;
		totalCount++;
		var now = (Date.now()/1000).toFixed();
		waterFlowReading = `{"constant": ${constant}, "startTime": ${startTime}, "now": ${now}, "rateCount": ${rateCount}, "totalCount": ${totalCount}, "flowRate": ${((rateCount * constant)/interval).toFixed(2)}, "time": ${minute}}`;
	});
	//Reset rateCount and increment minute every 60 seconds
	setInterval(function(){
		minute++;
		rateCount = 0;
	}, 60000);
}

//Test execution
monitorWaterFlow(17);

//Get updated value
setInterval (function(){
	console.log(waterFlowReading)
}, 1000);

module.exports = {
	monitorWaterFlow
}
