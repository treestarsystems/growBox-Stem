/*
For GrowBox-Stem (Environment Controller)
Purpose - A collection of sensor data collection functions
Inputs  -
Action  -
*/

var fs = require('fs');

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

module.exports = {
	readSensorSingle,
	readSensorAll
}
