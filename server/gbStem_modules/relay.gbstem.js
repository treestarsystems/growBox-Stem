/*
For GrowBox-Stem (Environment Controller)
Purpose - A collection of relay control functions
Inputs  -
Action  -
*/

const Gpio = require('onoff').Gpio;

//0 = On|Low /1 = Off|High
//Please enter a valid GPIO pin number - <GPIO.BMC> number
//Please enter a valid Task - on|off
function relayControl (pin, task) {
	var invalidGpio = {"status": {"code": "500", "codeType": "error", "message": "Please enter a valid GPIO pin number - <GPIO.BMC> number"}};
	var invalidTask = {"status": {"code": "500", "codeType": "error", "message": "Please enter a valid Task - on|off"}};
	var validRequest = {"status": {"code": "200", "codeType": "success", "message": "Completed"}};
	if ((Number.isInteger(pin)) && (pin)) {
		if (((task == 'on') || (task == 'off')) && (task)) {
			const relay = new Gpio(pin, 'out');
			if (task == 'on') {
				relay.writeSync(0);
				return validRequest;
			} else if (task == 'off') {
				relay.writeSync(1);
				relay.unexport();
				return validRequest;
			} else {
				relay.unexport();
			}
		} else {
			return invalidTask;
		}
	} else {
	return invalidGpio;
	}
}

//Test execution string
/*
relayControl (5, 'off');
*/

module.exports = {
	relayControl
}
