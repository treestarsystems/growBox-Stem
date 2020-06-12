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

function monitorWaterFlow(pin, cli, file) {
	const flowSensor = new Gpio(pin, 'in', 'falling');
	flowSensor.watch((err, value) => {
		if (err) {
			throw err;
		}
		rateCount++;
		totalCount++;
		now = (Date.now()/1000).toFixed();
		reading = {"constant": constant, "startTime": startTime, "now": now, "rateCount": rateCount, "totalCount": totalCount, "flowRate": ((rateCount * constant)/interval).toFixed(2), "time": minute};
		if (cli == 1) {
			console.log(reading);
		}
		if (file) {
			let data = JSON.stringify(reading,null);
			//Write to file or data base in this case.
			fs.writeFileSync(file, data);
		}
	});
	//Reset rateCount and increment minute every 60 seconds
	setInterval(function(){
		minute++;
		rateCount = 0;
	}, 60000);
}

module.exports = {
	monitorWaterFlow
}
