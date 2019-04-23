/*
Water Flow Monitoring:
Purpose - Measure the flow or liquid through a flow sensor.
Inputs  -
Action  -
*/
const Gpio = require('onoff').Gpio;
//Define our GPIO pins to wach and control
//Will replace hard-coded values later.
const flowSensor = new Gpio(27, 'in', 'falling');

var rateCount = 0;
var totalCount = 0;
var minutes = 0;
//Must be gathered by running water through flow meter and timing the amount of time until full.
var constant = 0.10;
var startTime = (Date.now()/1000).toFixed();
var now = 0;

function monitorWaterFlow() {
	flowSensor.watch((err, value) => {
		if (err) {
			throw err;
		}
		rateCount++;
		totalCount++;
	});
}

//Run the code above
monitorWaterFlow();

setInterval(
	function () {
		now = (Date.now()/1000).toFixed();
/*
		console.log(startTime);
		console.log(now);
		console.log((now - startTime));
*/
		//If the difference in time is divisible by 60 with no remainder.
		if (((now - startTime) % 60) === 0) {
			console.log((rateCount * constant).toFixed(2));
		}
	}, 1000);

process.on('SIGINT', () => {
	flowSensor.unexport();
});
