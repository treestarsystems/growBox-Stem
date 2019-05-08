/*
For GrowBox-Stem (Environment Controller)
Purpose - A collection of core functions
Inputs  -
Action  -
*/

var fs = require('fs');
const Gpio = require('onoff').Gpio;

//For waterflow monitoring
var rateCount = 0;
var totalCount = 0;
var minutes = 0;
//Must be gathered by running water through flow meter and timing the amount of time until full.
var constant = 0.10;
//Take current time, convert from miliseconds to seconds, take off decimals.
var startTime = (Date.now()/1000).toFixed();
var now = 0;
//var interval = 60;

function temperatureConversion(temperature, scale) {
	//From millidegree Celsius to Celsius
	if (scale == 'c') {
		return temperature/1000;
	}

	//From millidegree Celsius to Fahrenheit
	if (scale == 'f') {
		return ((temperature/1000)*9/5)+32;
	}

	//From millidegree Celsius to Kelvin
	if (scale == 'k') {
		return (temperature/1000)+273.15;
	}
}

function readSensorSingle (sensorID) {
	//Read the w1_slave file contianed in the directory identified by its Unique ID
	fs.readFile(`/sys/bus/w1/devices/${sensorID}/w1_slave`, function(err, data) {
		if(err) throw err;
		//Remove white spaces from array
		var sensorDataArray = data.toString().replace( /\n/g, " " ).split( " " ).filter(
			function(str) {
    				return /\S/.test(str);
			}
		);
		//Get last value in array and remove the preceding t= from output using substring.
		var sensorTemperatureReadingRaw = (sensorDataArray[sensorDataArray.length-1].substring(2));
	});
	return sensorTemperatureReadingRaw;
}

function readSensorAll () {
	console.log('test');
}

//0 = On|Low /1 = Off|High
//Please enter a valid GPIO pin number - <GPIO.BMC> number
//Please enter a valid Task - on|off
function relayControl (pin, task) {
	var invalidGpio = '{ "status": {"code": "500", "codeType": "error", "message": "Please enter a valid GPIO pin number - <GPIO.BMC> number"}}';
	var invalidTask = '{ "status": {"code": "500", "codeType": "error", "message": "Please enter a valid Task - on|off"}}';
	var validRequest = '{ "status": {"code": "200", "codeType": "success", "message": "Completed"}}';
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

function monitorWaterFlow(pin) {
//	const Gpio = require('onoff').Gpio;
	//Define the GPIO pin(s) to watch, control, and necessary options
	now = (Date.now()/1000).toFixed();
	interval = 60;
	const flowSensor = new Gpio(pin, 'in', 'falling');
	var waterFlowReading = `{"constant": ${constant}, "startTime": ${startTime}, "now": ${now}, "rateCount": ${rateCount}, "totalCount": ${totalCount}, "flowRate": ${(rateCount * constant).toFixed(2)}, "revolutions": ${(rateCount * constant).toFixed(2)}, "time": ${(now - startTime)/interval}}`;
	flowSensor.watch((err, value) => {
		if (err) {
			throw err;
		}
		rateCount++;
		totalCount++;
	});
	return waterFlowReading;
}

//This will go on until something terminates it. Exmaple: FLoat valve should trigger end of execution.
//console.log(monitorWaterFlow(5));
