/*
For GrowBox-Stem (Environment Controller)
Purpose - A collection of core functions and variables
Inputs  -
Action  -
*/

const os = require('os');
const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const emoji = require('node-emoji');
const system = require('../../system_confs/system_vars.json');

//Variables and Constants
var coreVars = {
 "projectName": "growBox-Stem",
 "installedDir": path.join(__dirname, '../..'),
}

//Required directories and file
coreVars.systemConfsDir = `${coreVars.installedDir}/system_confs`;
coreVars.systemConfig = `${coreVars.systemConfsDir}/system_conf.json`;
coreVars.logStoreDir = `${coreVars.installedDir}/log_storage`;

coreVars.instanceId = `${coreVars.logStorage}/pid/${coreVars.projectName}_Instance.id`;
coreVars.userInfo = getUserInfo();

//Get numeric id for the gb user from system_confs/system_user.json file.
function getUserInfo() {
 uid = parseInt(childProcess.execSync(`id -u ${system.username}`).toString().replace(/\n$/, ''));
 gid = parseInt(childProcess.execSync(`id -g ${system.username}`).toString().replace(/\n$/, ''));
 return {"uid": uid,"gid": gid,"userName": system.username};
}

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

function changePerm (path) {
 fs.chown(path,coreVars.userInfo.uid,coreVars.userInfo.gid, (err) => {
  if(err) throw err;
 });
 fs.chmod(path, 0o770, (err) => {
  if(err) throw err;
 });
}

function createDir (path) {
 fs.mkdir(path, (err) => {
  if(err) throw err;
 });
 changePerm (path);
 console.log(`Dir Created: ${path}`);
}

//Used to check if the app is started as the correct user (www-data) due to permissions requirements.
function incorrectUser (user,host,port) {
 if (process.env.USER != coreVars.userInfo.userName) {
  console.log(`\nCurrent User: ${emoji.emojify(`:x::scream: ${user} :scream::x:`)}`);
  console.log(`This process must be ran as the ${coreVars.userInfo.userName} user or else permission errors will impede functionality.\n`);
  process.exit(0);
 } else {
  var startMessage = console.log(`\nServer started by ${user} on ${host}:${port} in ${process.env.NODE_ENV} mode`);
  //Sets a new process environment variable that the app will use to run the start script.
  process.env['CORRECT_USER'] = true;
 }
}

//Generate a random alphanumeric string
function genRegular(x) {
 var regularchar = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
 var text = "";

 for (var i = 0; i < x; i++)
  text += regularchar.charAt(Math.floor(Math.random() * regularchar.length));
 return text;
}

//Generate a random alphanumeric string
function genSpecial(x) {
 var specialchar = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#%&-_";
 var text = "";

 for (var i = 0; i < x; i++)
  text += specialchar.charAt(Math.floor(Math.random() * specialchar.length));
 return text;
}

//Generate a random alpha string. Letter "O" & "I" removed
function genAlphaCap(x) {
 var regularchar = "ABCDEFGHJKLMNPQRSTUVWXYZ";
 var text = "";
 for (var i = 0; i < x; i++)
  text += regularchar.charAt(Math.floor(Math.random() * regularchar.length));
  return text;
}

//Generate a random alphanumeric string. Letter "O" & "I" removed
function genAlphaNumericCap(x) {
 var regularchar = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
 var text = "";
 for (var i = 0; i < x; i++)
  text += regularchar.charAt(Math.floor(Math.random() * regularchar.length));
  return text;
}

//Generate a random number within defined range
function getRandomNumber(min, max) {
 return Math.round(Math.random() * (max - min) + min);
}

function isJson(str) {
 try {
  JSON.parse(str);
 } catch (e) {
  return false;
 }
 return true;
}

module.exports = {
 genRegular,
 genSpecial,
 getRandomNumber,
 genAlphaCap,
 genAlphaNumericCap,
 createDir,
 changePerm,
 incorrectUser,
 coreVars,
 system,
 isJson,
 temperatureConversion
}
