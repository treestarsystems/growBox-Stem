/*
For GrowBox-Stem (Environment Controller)
Purpose - A collection of sensor data collection functions
Inputs  -
Action  -
*/

const fs = require('fs');
const {promisify} = require('util');
//I have no idea why the basic fs.readdir and fs.readFile doesnt work as expected.
//Im freaking loosing it!...ANSWER: I just needed a callback since async/await was being a bitch!
const readFileAsync = promisify(fs.readFile);
const core = require('./core.js');

function processData(sensorID, data) {
 //Remove white spaces from array
 var sensorDataArray = data.toString().replace( /\n/g, " " ).split( " " ).filter((str) => {
  return /\S/.test(str);
 });
 //Get last value in array and remove the preceding t= from output using substring.
 var sensorTemperatureReadingRaw = sensorDataArray[sensorDataArray.length-1].substring(2);
 var sensorTemperatureReadingParsed = {
  [sensorID]: {
   "reading": {
    "raw": Number(sensorTemperatureReadingRaw),
    "c": core.temperatureConversion(sensorTemperatureReadingRaw, 'c'),
    "f": core.temperatureConversion(sensorTemperatureReadingRaw, 'f'),
    "k": core.temperatureConversion(sensorTemperatureReadingRaw, 'k')
   }
  }
 };
 return sensorTemperatureReadingParsed;
};

async function readSensorSingleDS18B20 (sensorID) {
 if (sensorID) {
  sensorFilePath = `/sys/bus/w1/devices/${sensorID}/w1_slave`;
  try {
   let text = await readFileAsync(sensorFilePath, {encoding: 'utf8'});
   return {"status":"success", "message": "Task completed.", "data": [processData(sensorID, text)]};
  } catch (err) {
   return {"status":"failure", "message": "Invalid sensorID"};
  }
 } else {
   return {"status":"failure", "message": "Please enter a sensorID"};
 }
}

async function readSensorAllDS18B20 (callback,onlyList) {
 let sensorDir = `/sys/bus/w1/devices`
 let sensorDataResults = [];
 fs.readdir(sensorDir, 'utf8', (err,list) => {
  if (err) {
   callback({[sensorID]: {"status":"failure", "message": JSON.stringify(err)}});
  }
  let sensors = list.filter(e => !e.includes('w1_bus_master1'))
  //Only return an array/list of sensors
  if (onlyList) {
   callback({"status":"success", "message": "Task completed.", "data": sensors});
  } else {
   sensors.forEach(async (s,i) => {
    let singleSensorResult = await readSensorSingleDS18B20(s)
    //The readSensorSingleDS18B20 already returns an array with a single item.
    sensorDataResults.push(singleSensorResult.data[0]);
    if (sensors.length - 1 == i) {
     callback({"status":"success", "message": "Task completed.", "data": sensorDataResults});
    }
   });
  }
 });
}

//Test execution using Promise.prototype.then() to return a promise
//readSensorSingleDS18B20('28-011830a39bff').then(console.log)
//readSensorAllDS18B20(console.log)
//Only return a list/array of sensors
//readSensorAllDS18B20(console.log,true)

module.exports = {
 readSensorSingleDS18B20,
 readSensorAllDS18B20
}
