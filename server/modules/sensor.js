/*
For GrowBox-Stem (Environment Controller)
Purpose - A collection of sensor data collection functions
Inputs  -
Action  -
*/

const fs = require('fs');
const {promisify} = require('util');
//I have no idea why the basic fs.readdir and fs.readFile doesnt work as expected.
//Im freaking loosing it!
const readFileAsync = promisify(fs.readFile);
const readDirAsync = promisify(fs.readdir);
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
 sensorFilePath = `/sys/bus/w1/devices/${sensorID}/w1_slave`;
 try {
  let text = await readFileAsync(sensorFilePath, {encoding: 'utf8'});
  return {"status":"success", "message": processData(sensorID, text)};
 } catch (err) {
  return {[sensorID]: {"status":"failure", "message": JSON.stringify(err)}};
 }
}

async function readSensorAllDS18B20 (callback,api) {
 let sensorDir = `/sys/bus/w1/devices`
 let sensorDataResults = [];
 fs.readdir(sensorDir, 'utf8', (err,list) => {
  if (err) {
   if (api == true) {
//    callback.send({[sensorID]: {"status":"failure", "message": JSON.stringify(err)}});
   }
  }
  let sensors = list.filter(e => !e.includes('w1_bus_master1'))
  sensors.forEach(async (s,i) => {
   let singleSensorResult = await readSensorSingleDS18B20(s)
   sensorDataResults.push(singleSensorResult.message);
   if (sensors.length - 1 == i) {
    if (api == true) {
     callback.send({"status":"success", "message": sensorDataResults});
    } else {
     callback(sensors);
    }
   }
  });
 });
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
