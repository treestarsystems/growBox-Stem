const Gpio = require('onoff').Gpio;
//Define our GPIO pins to wach and control
//Will replace hard-coded values later.
const topFloat = new Gpio(17, 'out');
//This opens the valve when called. Most likely I am not using this right.
const intakeValve = new Gpio(5, 'out');

//If relay is ON/Closed then turn it OFF/Open.
function closeValve() {
	console.log('Checking is Valve is Open.');
	if (intakeValve.readSync() == 0) {
		console.log('Now Closing');
		intakeValve.writeSync(1);
	}
}

function monitorWaterLevel() {
	/*
	During testing the Ball Float used outputs 1s when at its lowest point
	(away from wires). This is away from the top or fill line thus the 
	relay the valve	is connected to should be opened (0|Low).
	*/

	//Water High, Close Valve.
	if (topFloat.readSync() == 0) {
		intakeValve.writeSync(1);
	//Water Low, Open Valve.
	} else {
		intakeValve.writeSync(0);
	}
}

//Run the code above
//Ensure Valve is closed first
closeValve();
//Allow time for valve to close then run function
setTimeout(monitorWaterLevel, 6000);
//Run function every half second checking the status of float
setInterval(monitorWaterLevel, 500);

process.on('SIGINT', () => {
  intakeValve.unexport();
  topFloat.unexport();
});
