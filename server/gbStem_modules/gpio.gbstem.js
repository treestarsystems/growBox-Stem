/*
For GrowBox-Stem (Environment Controller)
Purpose - Read/Write from/to GPIO pin
Inputs  -
Action  -
*/
const Gpio = require('onoff').Gpio;

//0 = On|Low|Float near wires /1 = Off|High|Float away from  wires
function readGpio (pin) {
	var invalidGpio = '{ "status": {"code": "500", "codeType": "error", "message": "Please enter a valid GPIO pin number - <GPIO.BMC> number"}}';

	if ((Number.isInteger(pin)) && (pin)) {
        	const gpio = new Gpio(pin, 'out');
		var validRequest = `{ "status": {"code": "200", "codeType": "success", "message": "Completed", "reading": readgpio.readSync()}}`;
		return validRequest;
	} else {
        	return invalidGpio;
	}
}

function writeGpio (pin) {
	var invalidGpio = '{ "status": {"code": "500", "codeType": "error", "message": "Please enter a valid GPIO pin number - <GPIO.BMC> number"}}';

	if ((Number.isInteger(pin)) && (pin)) {
        	const gpio = new Gpio(pin, 'out');
		gpio.writeSync()
		var validRequest = `{ "status": {"code": "200", "codeType": "success", "message": "Completed"}}`;
		return validRequest;
	} else {
        	return invalidGpio;
	}
}

module.exports = {
	readGpio,
	writeGpio
}
