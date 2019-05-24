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
mount points beside / to monitor
relay count - assign to variable then ask next ? that many times
relay pin
temp sesnse id - parse dir for ID strings that start with 28-????
console data refresh greater than 5secs
*/

var ipExpression = /((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))/;

function generalQs (generalAnswers) {
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
		switch(answers["sysType"].toLowerCase()) {
			case 'root':
				console.log('\n**growBox-Root Conf Questions**');
				rootQs(answers);
				break;
			case 'stem':
				console.log('\n**growBox-Stem Conf Questions**');
				stemQs(answers);
				break;
			case 'branch':
				console.log('\n**growBox-Branch Conf Questions**');
				branchQs(answers);
				break;
			case 'flower':
				console.log('\n**growBox-Flower Conf Questions**');
				flowerQs(answers);
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
//		console.log(answers);
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
  		message: `growBox-Root IP Address?`,
//		remove later
  		default: '1.1.1.1',
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
  		name: 'relayCount',
	  	message: `How many relays will be controlled?`,
//		remove later
  		default: '2',
  		validate: function(value) {
	     		var valid = !isNaN(parseFloat(value));
     			return valid || 'Please enter a number';
  		},
  		filter: Number
	},
	{
  		type: 'number',
  		name: 'internalTemperatureSensorCount',
//		remove later
  		default: '2',
  		message: `How many internal sensors will be controlled?`,
  		validate: function(value) {
     			var valid = !isNaN(parseFloat(value));
     			return valid || 'Please enter a number';
  		},
  		filter: Number
	}
	];

	inquirer.prompt(questions).then(answers => {
		answers["sysType"] = (generalAnswers["sysType"]).toLowerCase();
		answers["temperatureScale"] = generalAnswers["temperatureScale"];
		console.log('\n**growBox-Stem Relay Entry**');
		relayQs(answers);
//		return answers;
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
  		name: 'internalTemperatureSensorCount',
  		message: `How many internal sensors will be controlled?`,
  		validate: function(value) {
     			var valid = !isNaN(parseFloat(value));
     			return valid || 'Please enter a number';
  		},
  		filter: Number
	}
	];

	inquirer.prompt(questions).then(answers => {
		answers["sysType"] = (generalAnswers["sysType"]).toLowerCase();
		answers["temperatureScale"] = generalAnswers["temperatureScale"];
//		return answers;
		console.log(answers);
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
//		return answers;
		console.log(answers);
	});
}

function relayQs (stemAnswers) {
	stemAnswers["relayData"] = {};
	rc = stemAnswers["relayCount"];
	rcExPin = [];
	rcExDesc = [];

	//Create example of how data should be entered.
	for (i = 1; i <= rc; i++) {
		rcExPin.push(i);
	}

	for (i = 1; i <= rc; i++) {
		rcExDesc.push(`Water Pump ${i}`);
	}

	var questions = [
	{
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
			//matches numbers only. ['1a','1'] will be invalid
			var noLetters = /^\d+$/;
			//matches blank items in array. ['1',''] will be invalid
			var noBlanks = /^\s+$/;
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
  		name: 'description',
//		remove later
  		default: 'Water Pump,Light 1A',
  		message: `Please enter in a description? (Water Valve,Light 1A)`,
  		validate: function(value) {
			/*
			valid transform the data into an array with no white/blank spaces
			1. ' 40 ' becomes: '40'
			2 ' a ' becomes: 'a'
			*/
			valid = value.trim().split(',');
			//Matches blank items in array. ['1',''] will be invalid
			var noBlanks = /^\s+$/;
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
	}
	];

	inquirer.prompt(questions).then(answers => {
		stemAnswers["relayData"][i] = answers;
		console.log(answers);
//		console.log(JSON.stringify(stemAnswers));
//		return stemAnswers;
	});
}

//Execute code
generalQs();
