/*
Water Level Monitoring:
Purpose - Read the status of the highest and lowest sensor in the bucket/
	  reservoir.
Inputs  - Float valves connected to compatible GPIO pins and a Motorized/
	  Solenoid valve (2 Wire)that is controlled via a relay
Action  - When topFloat (status 1) OR bottomFloat (status 0) is falling
	  /low/hanging the valve is opened/stays opened. When topFloat is
	  high/up (status 0) the valve should be closed.
*/
const Gpio = require('onoff').Gpio;
//Define our GPIO pins to wach and control
//Will replace hard-coded values later.
const topFloat = new Gpio(17, 'out');
const bottomFloat = new Gpio(18, 'out');
//This opens the valve when called. Most likely I am not using this right.
const intakeValve = new Gpio(5, 'out');

//If relay is ON/Closed then turn it OFF/Open.
function closeValve() {
 if (intakeValve.readSync() == 0) {
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
 }
 //Water Low, Open Valve.
 if (bottomFloat.readSync() == 0 || topFloat.readSync() == 1) {
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
 bottomFloat.unexport();
});
