const Gpio = require('onoff').Gpio;
//const topFloat = new Gpio(17, 'in', 'rising', {debounceTimeout: 10});

//const topFloat = new Gpio(17, 'out', {debounceTimeout: 1000});
const topFloat = new Gpio(17, 'in', 'rising', {debounceTimeout: 1000});
const intakeValve = new Gpio(5, 'out');

while (true) {
	if (topFloat.readSync() == 0) {
		console.log('Float Value is 0|Water High');
		intakeValve.writeSync(0);
	} else {
		console.log('Float Value is 1|Water Low');
		intakeValve.writeSync(1);
	}
}
/*
During testing the Ball Float used outputs 1s when at its lowest point
(away from wires). This is away from the top or fill line thus the valve
should be opened (0|Low).
*/
/*
 if (value == 1) {
  console.log('Opening');
  intakeValve.writeSync(0);
 } else {
  intakeValve.writeSync(1);
  console.log('Closing');
 }
});
 
process.on('SIGINT', () => {
  intakeValve.unexport();
  topFloat.unexport();
});
*/
