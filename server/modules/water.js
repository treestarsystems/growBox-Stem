/*
For growBox-Stem (Environment Controller)
Purpose - A collection of water control functions
Inputs  -
Action  -
*/

const Gpio = require('onoff').Gpio;
const fs = require('fs');

//For waterflow monitoring
var rateCount = 0;
var totalCount = 0;
var constant = 0.10;
var startTime = (Date.now()/1000).toFixed();
var now = 0;
var interval = 60;
var minute = 0;

//function monitorWaterFlow(pin, cli, file) {
function monitorWaterFlow(pin, output, destination) {
 const flowSensor = new Gpio(pin, 'in', 'falling');
 flowSensor.watch((err, value) => {
  if (err) {throw err;}
  rateCount++;
  totalCount++;
  now = (Date.now()/1000).toFixed();
  reading = {
   "constant": constant,
   "startTime": startTime,
   "now": now,
   "rateCount": rateCount,
   "totalCount": totalCount,
   "flowRate": ((rateCount * constant)/interval).toFixed(2), "time": minute
  };
  if (output == 'cli') {
   console.log(reading);
  }
  if (output == 'file') {
   let data = JSON.stringify(reading,null);
   //Write to file or data base in this case.
   fs.writeFileSync(destination, data);
  }
  if (output == 'api') {
   //Axios send to root server(s) defined by destination.
  }
 });
 //Reset rateCount and increment minute every 60 seconds
 setInterval(function(){
  minute++;
  rateCount = 0;
 }, 60000);
}

monitorWaterFlow(18,'cli')

module.exports = {
 monitorWaterFlow
}
