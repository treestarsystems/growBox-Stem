#!/usr/bin/env node
/*
For growBox-Stem (Environment Controller)
Purpose - Initial system setup script.
Inputs  - Take in user data from console.
Action  - Write user data and setup environment.
Status  - Developing / Incomplete.
*/

const os = require( 'os' );
const fs = require( 'fs' );
const disk = require('diskusage');
const inquirer = require('inquirer')
const core = require('../server/gbStem_modules/core.gbstem.js');
var timeOptions = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' };
var argv = require('minimist')(process.argv.slice(2));


/*
What input do I need?
temp sesnse id - parse dir for ID strings that start with 28-????
console data refresh greater than 5secs
*/

//matches IPv4/6
var ipExpression = /((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))/;
//Escapes special characters where necessary.
var escapeSpecial = /[-[\]{}()*+?.,\\/^$|#\s]/g;
//matches numbers only. ['1a','1'] will be invalid
var noLetters = /^\d+$/;
//matches blank items in array. ['1',''] will be invalid
var noBlanks = /^\s+$/;

function generalQs () {
	var questions = [
	{
  		type: 'list',
  		name: 'sysType',
  		message: "What type of system is this?",
  		choices: ['Root', 'Stem', 'Branch', 'Flower'],
		validate: function(val) {
			return val.toLowerCase();
		}
	},
	{
	  	type: 'expand',
  		name: 'consoleRefresh',
	  	message: `How often should the console refresh itself?`,
  		choices: [
      			{
			key: 'a',
			name: '10 secs',
			value: '10'
      			},
      			{
			key: 'b',
			name: '20 secs',
			value: '20'
      			},
      			{
			key: 'c',
			name: '30 secs',
			value: '30'
      			},
      			{
			key: 'd',
			name: '60 secs',
			value: '60'
      			}
    		],
		default: 'd'
	},
	{
	  	type: '',
  		name: 'temperatureScale',
	  	message: `Desired temperature scale?`,
  		choices: [
      			{
			key: 'C',
			name: 'C - Celsius',
			value: 'c'
      			},
      			{
			key: 'F',
			name: 'F - Fahrenheit',
			value: 'f'
      			},
      			{
			key: 'K',
			name: 'K - Kelvin',
			value: 'k'
      			}
    		],
		default: 'f'
	},
	]

	inquirer.prompt(questions).then(answers => {
		generalAnswers = {}
		generalAnswers["system"] = answers;
		generalAnswers["system"]["sysType"] = answers["sysType"].toLowerCase();
		switch(generalAnswers["system"]["sysType"].toLowerCase()) {
			case 'root':
				console.log('\n**growBox-Root Conf Questions**');
				rootQs(generalAnswers);
				break;
			case 'stem':
				console.log('\n**growBox-Stem Conf Questions**');
				stemQs(generalAnswers);
				break;
			case 'branch':
				console.log('\n**growBox-Branch Conf Questions**');
				branchQs(generalAnswers);
				break;
			case 'flower':
				console.log('\n**growBox-Flower Conf Questions**');
				flowerQs(generalAnswers);
				break;
		}
	})
}

function rootQs (generalAnswers) {
	var defaultHostname = `root-${core.genRegular(5)}`;
	var questions = [
	{
  		type: 'input',
  		name: 'hostname',
  		message: `Desired local hostname? (${defaultHostname})`,
  		default: defaultHostname
	},
	{
  		type: 'input',
  		name: 'db',
  		message: `Desired db? (${defaultHostname})`,
  		default: defaultHostname
	}
	];

	inquirer.prompt(questions).then(answers => {
		answers["sysType"] = (generalAnswers["sysType"]).toLowerCase();
		answers["temperatureScale"] = generalAnswers["temperatureScale"];
		return answers;
	});
}

function stemQs (generalAnswers) {
	var defaultHostname = `stem-${core.genRegular(5)}`;
	var questions = [
	{
  		type: 'input',
  		name: 'hostname',
  		message: `Desired local hostname? (${defaultHostname})`,
  		default: defaultHostname
	},
	{
  		type: 'input',
  		name: 'gbRootAddress',
  		message: `growBox-Root IPv4/6 Address?`,
  		validate: function(value) {
   		var valid = value.match(ipExpression);
			if (valid) {
				return true;
			}
			return 'Please enter a valid IPv4/6 Address';
  		}
	},
	{
  		type: 'input',
  		name: 'gbRootUser',
  		message: `growBox-Root Username`,
  		default: `stemuser${core.genRegular(15)}`
	},
	{
  		type: 'input',
  		name: 'gbRootPassword',
  		message: `growBox-Root Password`,
  		default: `${core.genSpecial(45)}`,
	},
	//This needs validate logic and then needs to be stored as an array within the localDisks object
	{
  		type: 'input',
  		name: 'localDisks',
  		message: `Enter the path(s) of a local mounted disk you would like to monitor.\n**Paths must be seperated by commas.`,
  		default: `/,/mnt/usb,/mnt/backup-drive`,
		validate: function(value) {
			/*
			valid transform the data into an array with no white/blank spaces
			1. '4 0' becomes: '40'
			2 ' a' becomes: 'a' <---this will checked later.
			*/
			valid = value.split(',');
			pc = (value.split(',')).length;
			//Will be incremented to equal rc (relayCount)
			progress = 0;
			if (Array.isArray(valid)) {
				verify();
				if (progress == pc) {
					return true;
				}
			}
			return `\n**Please enter each path seperated by commas\n**Example: /,/mnt/usb,/mnt/backup-drive`;

			function verify () {
				valid.forEach((element) => {
					if (element.length != 0 && !element.match(noBlanks) && element !== undefined) {
						progress++;
					}
				});
			}
		},
	},
	{
	  	type: 'number',
  		name: 'relayCount',
	  	message: `How many relays will be controlled?`,
  		validate: function(value) {
	     		var valid = !isNaN(parseFloat(value));
     			return valid || 'Please enter a number';
  		},
  		filter: Number
	},
	{
  		type: 'number',
  		name: 'internalDS18B20TemperatureSensorCount',
  		message: `How many internal DS18B20 sensors will be controlled?`,
  		validate: function(value) {
     			var valid = !isNaN(parseFloat(value));
     			return valid || 'Please enter a number';
  		},
  		filter: Number
	}
	];

	inquirer.prompt(questions).then(answers => {
		generalAnswers["stem"] = answers;
		if ((generalAnswers["stem"]["relayCount"] > 0) || (generalAnswers["stem"]["internalDS18B20TemperatureSensorCount"] > 0)) {
			console.log('\n**growBox-Stem Relay & Temperature Sensor Entry**');
			relayAndSensorQs(generalAnswers);
		} else {
			return generalAnswers;
		}
	})
}

function branchQs (generalAnswers) {
	var defaultHostname = `branch-${core.genRegular(10)}`;
	var questions = [
	{
  		type: 'input',
  		name: 'hostname',
  		message: `Desired local hostname? (${defaultHostname})`,
  		default: defaultHostname
	},
	{
  		type: 'input',
  		name: 'gbRootAddress',
  		message: `growBox-Root IP Address?`,
  		validate: function(value) {
   		var valid = value.match(ipExpression);
			if (valid) {
				return true;
			}
			return 'Please enter a valid IP Address';
  		}
	},
	{
  		type: 'number',
  		name: 'internalDS18B20TemperatureSensorCount',
  		message: `How many internal sensors will be controlled?`,
  		validate: function(value) {
     			var valid = !isNaN(parseFloat(value));
     			return valid || 'Please enter a number';
  		},
  		filter: Number
	}
	];

	inquirer.prompt(questions).then(answers => {
		answers["system"]["sysType"] = (generalAnswers["system"]["sysType"]).toLowerCase();
		answers["system"]["temperatureScale"] = generalAnswers["system"]["temperatureScale"];
		return answers;
	});
}

function flowerQs (generalAnswers) {
	var defaultHostname = `flower-${core.genRegular(5)}`;
	var questions = [
	{
  		type: 'input',
  		name: 'hostname',
  		message: `Desired local hostname? (${defaultHostname})`,
  		default: defaultHostname
	},
	{
  		type: 'input',
  		name: 'gbRootAddress',
  		message: `growBox-Root IP Address?`,
  		validate: function(value) {
   		var valid = value.match(ipExpression);
			if (valid) {
				return true;
			}
			return 'Please enter a valid IP Address';
  		}
	},
	];

	inquirer.prompt(questions).then(answers => {
		answers["sysType"] = (generalAnswers["sysType"]).toLowerCase();
		answers["temperatureScale"] = generalAnswers["temperatureScale"];
		return answers;
	});
}

function relayAndSensorQs (stemAnswers) {
	stemAnswers["stem"]["relayData"] = {};
	stemAnswers["stem"]["sensorData"] = {};
	rc = stemAnswers["stem"]["relayCount"];
	isc = stemAnswers["stem"]["internalDS18B20TemperatureSensorCount"];

	rcExPin = [];
	rcExDesc = [];

	//Create example of how data should be entered.
	for (i = 1; i <= rc; i++) {
		rcExPin.push(i);
	}

	for (i = 1; i <= rc; i++) {
		rcExDesc.push(`Water Pump ${i}`);
	}

	var questions = [];

	//Add Relay questions
	if (rc > 0) {
		questions.push({
	  		type: 'input',
	  		name: 'pin',
	  		message: `Enter each relays corresponding <GPIO.BMC> number.`,
	  		validate: function(value) {
				/*
				valid transform the data into an array with no white/blank spaces
				1. '4 0' becomes: '40'
				2 ' a' becomes: 'a' <---this will checked later.
				*/
				valid = value.replace(/\s/g, "").split(',');
				//Will be incremented to equal rc (relayCount)
				progress = 0;
				if (Array.isArray(valid)) {
					if (valid.length == rc) {
						verify();
						if (progress == rc) {
							return true;
						}
					}
				}
				return `\n**Please enter numbers only\n**Seperated by commas\n**Blank spaces will be removed\n**Example: ${rcExPin}`;

				/*
				This was a bit annoying to figure out but this funtion runs through array to:
				1. verify it is a number.
				2. increment progress counter to match the value of relays entered previously.
				*/
				function verify () {
					valid.forEach((element) => {
						if (element.match(noLetters) && !element.match(noBlanks)) {
							progress++;
						}
					});
				}
	  		},
		},
		{
	  		type: 'input',
	  		name: 'relayDescription',
	  		message: `Please enter in a description? (Rear case,Light 1A)`,
	  		validate: function(value) {
				/*
				valid transform the data into an array with no white/blank spaces
				1. ' 40 ' becomes: '40'
				2 ' a ' becomes: 'a'
				*/
				valid = value.trim().split(',');
				//Will be incremented to equal rc (relayCount)
				progress = 0;
				if (Array.isArray(valid)) {
					if (valid.length == rc) {
						verify();
						if (progress == rc) {
							return true;
						}
					}
				}
				return `\n**Seperate descriptions by commas\n**Blank spaces will be removed from the beginning and end of element\n**Example: ${rcExDesc}`;

				/*
				This was a bit annoying to figure out but this funtion runs through array to:
				1. verify it is a number.
				2. increment progress counter to match the value of relays entered previously.
				*/
				function verify () {
					valid.forEach((element) => {
						if (!element.match(noBlanks)) {
							progress++;
						}
					});
				}
	  		},
		});
	}

	//Add Internal Sensor questions
	if (isc > 0) {
		questions.push({
	  		type: 'input',
	  		name: 'internalDS18B20TemperatureID',
	  		message: `Enter each DS18B20 Sensor ID.\n**Ex: 28-011830a09cff,28-011a630a09cff`,
	  		validate: function(value) {
				/*
				valid transform the data into an array with no white/blank spaces
				1. '4 0' becomes: '40'
				2 ' a' becomes: 'a' <---this will checked later.
				*/
				valid = value.split(',');
				//Will be incremented to equal isc (sensorCount)
				progress = 0;
				if (Array.isArray(valid)) {
					if (valid.length == isc) {
						verify();
						if (progress == isc) {
							return true;
						}
					}
				}
				return `\n**Please enter correct Sensor ID\n**Seperated by commas\n**Blank spaces will be removed\n**Ex: 28-011830a09cff,28-011a630a09cff`;

				/*
				This was a bit annoying to figure out but this funtion runs through array to:
				1. verify it is not empty.
				2. increment progress counter to match the value of relays entered previously.
				*/
				function verify () {
					valid.forEach((element) => {
						if (element.length != 0 && !element.match(noBlanks) && element !== undefined) {
							progress++;
						}
					});
				}
	  		},
		},
		{
	  		type: 'input',
	  		name: 'sensorDescription',
	  		message: `Please enter a sensor description? (Rear case sensor, Battery Sensor)`,
	  		validate: function(value) {
				/*
				valid transform the data into an array with no white/blank spaces
				1. ' 40 ' becomes: '40'
				2 ' a ' becomes: 'a'
				*/
				valid = value.replace(/\s/g, "").split(',');
				//Will be incremented to equal rc (sensorCount)
				progress = 0;
				if (Array.isArray(valid)) {
					if (valid.length == isc) {
						verify();
						if (progress == isc) {
							return true;
						}
					}
				}
				return `\n**Seperate descriptions by commas\n**Blank spaces will be removed from the beginning and end of element\n**Example: ${rcExDesc}`;

				/*
				This was a bit annoying to figure out but this funtion runs through array to:
				1. verify it is empty.
				2. increment progress counter to match the value of relays entered previously.
				*/
				function verify () {
					valid.forEach((element) => {
						if (element.length != 0 && !element.match(noBlanks) && element !== undefined) {
							progress++;
						}
					});
				}
	  		},
		});
	}

	if ((rc > 0) || (isc > 0)) {
		inquirer.prompt(questions).then(answers => {
			if (rc > 0) {
				var i = 0;
				answers.pin.split(',').forEach((element) => {
					stemAnswers["stem"]["relayData"][i+1] = {"pin": answers.pin.split(',')[i],"description": answers.relayDescription.split(',')[i]};
					i++;
				});
			}
			if (isc > 0) {
				var o = 0;
				answers.internalDS18B20TemperatureID.split(',').forEach((element) => {
					stemAnswers["stem"]["sensorData"][o+1] = {"sensor": answers.internalDS18B20TemperatureID.split(',')[o],"sensorDescription": answers.sensorDescription.split(',')[o]};
					o++;
				});
			}
			writeSettings(stemAnswers);
		});
	}
}

//This will contain the code to log or write(file/db) the collected answers.
function writeSettings (completedAnswers) {
	console.log(JSON.stringify(completedAnswers));
}

//Execute code
generalQs();
