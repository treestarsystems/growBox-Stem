/*
For GrowBox-Stem (Environment Controller)
Purpose - A collection of sensor data collection functions
Inputs  -
Action  -
*/

const fs = require('fs');
const {promisify} = require('util');
const readFileAsync = promisify(fs.readFile);

function processData(sensorID, data) {
	//Remove white spaces from array
	var sensorDataArray = data.toString().replace( /\n/g, " " ).split( " " ).filter(
		function(str) {
			return /\S/.test(str);
		}
	);

	//Get last value in array and remove the preceding t= from output using substring.
	var sensorTemperatureReadingRaw = sensorDataArray[sensorDataArray.length-1].substring(2);
	var sensorTemperatureReadingParsed = {[sensorID]:{"reading": (sensorDataArray[sensorDataArray.length-1].substring(2))}};
	return sensorTemperatureReadingParsed;
};

async function readSensorSingleDS18B20 (sensorID) {
	sensorFilePath = `/sys/bus/w1/devices/${sensorID}/w1_slave`;
	try {
        	const text = await readFileAsync(sensorFilePath, {encoding: 'utf8'});
	        return processData(sensorID, text);
    	}
    	catch (err) {
        	return {[sensorID]: {"error": JSON.stringify(err)}};
    	}
}

function readSensorAllDS18B20 () {
	console.log('test');
}

//Test execution using Promise.prototype.then() to return a promise
/*
readSensorSingleDS18B20('28-011830a39bff')
	.then(console.log)
*/

module.exports = {
	readSensorSingleDS18B20,
	readSensorAllDS18B20
}