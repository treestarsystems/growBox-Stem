/*
For GrowBox-Stem (Environment Controller)
Purpose - Read/Write from/to GPIO pin
Inputs  -
Action  -
*/
const Gpio = require('onoff').Gpio;

//0 = On|Low|Float near wires /1 = Off|High|Float away from  wires
function readGpio (pin) {
	var invalidGpio = {"status": {"code": "500", "codeType": "error", "message": "Please enter a valid GPIO pin number - <GPIO.BMC> number"}};

	if ((Number.isInteger(pin)) && (pin)) {
        	const gpio = new Gpio(pin, 'out');
		var validRequest = {"status": {"code": "200", "codeType": "success", "message": "Completed", "reading": gpio.readSync()}};
		return validRequest;
	} else {
        	return invalidGpio;
	}
}

function writeGpio (pin,value) {
	var invalidGpio = {"status": {"code": "500", "codeType": "error", "message": "Please enter a valid GPIO pin number - <GPIO.BMC> number"}};

	if ((Number.isInteger(pin)) && (pin)) {
        	const gpio = new Gpio(pin, 'out');
		gpio.writeSync(value)
		var validRequest = {"status": {"code": "200", "codeType": "success", "message": "Completed"}};
		console.log(validRequest);
		return validRequest;
	} else {
        	return invalidGpio;
	}
}

//Test execution. Must readd console.log lines before return values.
/*
readGpio(5);
writeGpio(5,1);
*/

module.exports = {
	readGpio,
	writeGpio
}
