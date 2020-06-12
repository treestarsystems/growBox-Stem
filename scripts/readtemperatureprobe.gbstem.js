#!/usr/bin/env node
/*
For GrowBox-Stem (Environment Controller)
Purpose - Read temperature data from file
Inputs  -
Action  -
*/

var fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));

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

function readSensor (sensorID) {
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

		//Testing my conversion function.
		console.log(`${temperatureConversion(sensorTemperatureReadingRaw, 'c')} C` );
		console.log(`${temperatureConversion(sensorTemperatureReadingRaw, 'f')} F` );
		console.log(`${temperatureConversion(sensorTemperatureReadingRaw, 'k')} K` );
	});
}

if (argv.sensor) {
	readSensor(argv.sensor)
}
