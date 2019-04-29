/*
Water Flow Monitoring:
Purpose - Measure the flow or liquid through a flow sensor.
Inputs  -
Action  -
*/

	var rateCount = 0;
	var totalCount = 0;
	var minutes = 0;
	//Must be gathered by running water through flow meter and timing the amount of time until full.
	var constant = 0.10;
	//Take current time, convert from miliseconds to seconds, take off decimals.
	var startTime = (Date.now()/1000).toFixed();
	var now = 0;

function monitorWaterFlow(pin) {
	const Gpio = require('onoff').Gpio;
	//Define the GPIO pin(s) to watch, control, and necessary options
	const flowSensor = new Gpio(pin, 'in', 'falling');

	flowSensor.watch((err, value) => {
		if (err) {
			throw err;
		}
		rateCount++;
		totalCount++;
	});
}

function displayWaterFlow () {
	//Take current time, convert from miliseconds to seconds, take off decimals.
	now = (Date.now()/1000).toFixed();
	interval = 60;
	//Run only if the difference in time is divisible by 60 with no remainder.
	if (((now - startTime) % interval) === 0) {
		console.log('Flow Rate: ' + ((rateCount * constant).toFixed(2)) + ' L/min');
		console.log('Revolutions: ' + ((totalCount * constant).toFixed(2)));
		console.log('Time: ' + (now - startTime)/interval + ' mins');
		console.log();
		rateCount = 0;
	}
}


//Run the code above
monitorWaterFlow(27);
//displayWaterFlow();
setInterval(displayWaterFlow, 1000);

process.on('SIGINT', () => {
	flowSensor.unexport();
});
