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
hostname
root server IP
mount points beside / to monitor
relay count - assign to variable then ask next ? that many times
relay pin
temp conversion - c,f,k
temp sesnse id - parse dir for ID strings that start with 28-????
console data refresh greater than 5secs
*/

var questions = [{
  type: 'input',
  name: 'sysType',
  message: "What type of system is this?",
}]

inquirer.prompt(questions).then(answers => {
  console.log(`This is a ${answers['sysType']}`)
})
