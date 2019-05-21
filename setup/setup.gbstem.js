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

var defaultHostname = `stem-${core.genRegular(5)}`;
var ipExpression = /((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))/;

var questions = [
{
  type: 'list',
  name: 'sysType',
  message: "What type of system is this?",
  choices: ['Root', 'Stem', 'Branch', 'Flower'],
  filter: function(val) {
      return val.toLowerCase();
  }
},
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
  name: 'relayCount',
  message: `How many relays will be controlled?`,
  validate: function(value) {
     var valid = !isNaN(parseFloat(value));
     return valid || 'Please enter a number';
  },
  filter: Number
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
    ]
/*
  filter: function(value) {
      return val.toLowerCase();
  }
*/
},
{
  type: 'input',
  name: 'mountPoints',
  message: `Other mount points?`,
},
{
  type: 'input',
  name: 'hostname',
  message: `Desired hostname? (stem-${core.genRegular(5)})`,
},
{
  type: 'input',
  name: 'hostname',
  message: `Desired hostname? (stem-${core.genRegular(5)})`,
}
]

inquirer.prompt(questions).then(answers => {
  console.log(`System Type: ${answers['sysType']}`)
  console.log(`Hostname: ${answers['hostname']}`)
  console.log(`growBox-Root Address: ${answers['gbRootAddress']}`)
  console.log(`Relay Count: ${answers['relayCount']}`)
  console.log(`Temperature Scale: ${answers['temperatureScale']}`)
})
