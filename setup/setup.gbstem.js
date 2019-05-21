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
temp conversion - c,f,k
temp sesnse id - parse dir for ID strings that start with 28-????
console data refresh greater than 5secs
*/

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
  message: `Desired local hostname? (stem-${core.genRegular(5)})`,
},
{
  type: 'input',
  name: 'gbRootAddress',
  message: `growBox-Root IP Address?`,
},
{
  type: 'number',
  name: 'relayCount',
  message: `How many relays will be controlled?`,
},
{
  type: 'list',
  name: 'temperatureScale',
  message: `Desired temperature scale?`,
  choices: ['C - Celsius', 'F - Fahrenheit', 'K - Kelvin'],
  filter: function(val) {
      return val.toLowerCase();
  }
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
