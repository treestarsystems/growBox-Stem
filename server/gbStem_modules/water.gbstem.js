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
var waterFlowReading = 'test-glb-water';

function monitorWaterFlow(pin, log, file) {
	const flowSensor = new Gpio(pin, 'in', 'falling');
	flowSensor.watch((err, value) => {
		if (err) {
			throw err;
		}
		rateCount++;
		totalCount++;
		var now = (Date.now()/1000).toFixed();
		waterFlowReading = `{"constant": ${constant}, "startTime": ${startTime}, "now": ${now}, "rateCount": ${rateCount}, "totalCount": ${totalCount}, "flowRate": ${((rateCount * constant)/interval).toFixed(2)}, "time": ${minute}}`;
		//Outputs to console for CLI script
		if (log == 'on') {
			console.log(waterFlowReading)
		}
		if (file) {
			console.log('file is not null')
		}
	});

	//Reset rateCount and increment minute every 60 seconds
	setInterval(function(){
		minute++;
		rateCount = 0;
	}, 60000);
//	return waterFlowReading;
}

//The only way I think this will work is if the data outputs to a file then I read that file.
//Execution would look like water.monitorWaterFlow(argv.gpio, file_name)

module.exports = {
	monitorWaterFlow
}
