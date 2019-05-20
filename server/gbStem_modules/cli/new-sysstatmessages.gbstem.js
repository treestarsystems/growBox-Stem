#!/usr/bin/env node
/*
For growBox-Stem (Environment Controller)
Purpose - Output System Status Data to /dev/tty1 while
	  sending/receiving info to growBox-Root server.
Inputs  -
Action  -
Status  - Developing / Incomplete
*/

const os = require( 'os' );
const fs = require( 'fs' );
const disk = require('diskusage');
const tty = fs.createWriteStream('/dev/tty1');
const sensor = require('../sensor.gbstem.js');
const core = require('../core.gbstem.js');
var projectName = 'growBox - Stem (Environmental Control System)';
var timeOptions = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' };
//This should be retrieved from a local database. I think SQLite
var paths = [os.platform() === 'win32' ? 'c:' : '/', '/mnt/usb'];
var sensorID = '28-011830a39bff';

//Example of converting time to human readable string
//var today  = new Date();
//"currentTime": today.toLocaleDateString("en-US", timeOptions);

//Collect Disk Data
async function collectSystemStatusLocal() {
	var now  = Date.now();
	var nowHuman  = new Date(now);
	var collectedDataLocalDisks = collectSystemStatusDisks(paths);
	var collectedDataLocalInterfaces = collectSystemStatusInterfaces(os.networkInterfaces());
	var internalCaseTemperature = await sensor.readSensorSingleDS18B20(sensorID);
	var collectedDataLocal = {"currentTime": Date.now(),
				"currentTimeHuman": nowHuman.toLocaleDateString("en-US", timeOptions),
				"systemOS": os.type() + " " + os.release() + " " + os.arch(),
				//Gets 1 min load average
				"systemLoad": (os.loadavg()[0]).toFixed(2),
				"caseTemperature": internalCaseTemperature,
				"hostname": os.hostname(),
				"uptime": (os.uptime()/60).toFixed(),
				"memoryFree": (os.freemem()/1000000).toFixed(),
				"memoryTotal": (os.totalmem()/1000000).toFixed(),
				"disks": collectedDataLocalDisks,
				"networkInterfaces": collectedDataLocalInterfaces
	}
	return collectedDataLocal;
}

function collectSystemStatusDisks(paths) {
	var collectedDataLocalDiskData = {};
	var i = 0;
	paths.forEach(function(path){
		disk.check(path, function(err, info) {
                        if (err) {
                                console.log(err);
                        } else {
                                collectedDataLocalDiskData["disk"+i] = {"path": path,
                                        "diskFreeGb": (info.available/1024000000).toFixed(2),
                                        "diskTotalGb": (info.free/1024000000).toFixed(2),
                                        "diskUsedPercent": (100-((info.available/info.free)).toFixed(2)*100)
                                        }
                                i++;
                        }
                })
	});
	return collectedDataLocalDiskData;
}

//Collect Interface Data
function collectSystemStatusInterfaces(ints) {
	var collectedDataLocalNetwork = {};
	for (const [key, value] of Object.entries(ints)) {
		var i = 0;
		if (key != 'lo') {
			collectedDataLocalNetwork[key] = {"interfaceMac": value[0]['mac']};
			collectedDataLocalNetwork[key]["address"] = [];
			value.forEach(function(interface) {
				collectedDataLocalNetwork[key]["address"].push(interface['cidr']);
				i++;
			})
		}
	}
	return collectedDataLocalNetwork;
}

//Collect Relay Data
//This should be retrieved from a local database. I think SQLite
function collectSystemStatusRelays() {
	var collectedDataLocalRelayData = {};
	var i = 1;
	while (i <= 8) {
		collectedDataLocalRelayData[i] = {"pin": "value","status": "value","description": "value"};
		i++;
	}
	return collectedDataLocalRelayData;
}

//Collect Current Task(s) Info from growBox-Root
//Takes limit which is the amount of records you want returned or shown.
//async - This will be async

function collectSystemStatusTasksCurrent(limit) {
	var collectedDataRemoteTasksInfo = {};
	var i = 0;
	while (i < limit) {
		collectedDataRemoteTasksInfo[i] = {"type": "value","status": "value","description": "value","startTime": "value","endTime": "value"};
		i++;
	}
	return collectedDataRemoteTasksInfo;
}

//Collect Scheduled Task(s) Info from growBox-Root
//Takes limit which is the amount of records you want returned or shown.
//async - This will be async
function collectSystemStatusTasksScheduled(limit) {
	var collectedDataRemoteTasksInfo = {};
	var i = 0;
	while (i < limit) {
		collectedDataRemoteTasksInfo[i] = {"type": "value","status": "value","description": "value","startTime": "value","endTime": "value"};
		i++;
	}
	return collectedDataRemoteTasksInfo;
}

//Put it all together
async function aggregateSystemStatus() {
	var collectedDataLocalSystem = await collectSystemStatusLocal();
	var collectedDataLocalRelays = collectSystemStatusRelays();
	var collectedDataRemoteTasksCurrent = collectSystemStatusTasksCurrent(4);
	var collectedDataRemoteTasksScheduled = collectSystemStatusTasksScheduled(4);

	var collectedDataRemote = 0;
	var collectedData = {"projectName": projectName,
				"system": collectedDataLocalSystem,
				"relays": collectedDataLocalRelays,
				"tasksCurrent": collectedDataRemoteTasksCurrent,
				"tasksScheduled": collectedDataRemoteTasksScheduled
				}
/*
	\nTask Info:`);
	 -growBox - Root (Task Master):`);
	 --Name: root-1fPUas `);
	 --IP Address: 19.168.1.1 `);
	 --Last Communication: ${lcommDate.toLocaleDateString("en-US", timeOptions)} `);
*/

	return collectedData;
}

//Sends locally collected data to the growBox-Root
function sendCollectedData() {

}


async function displaySystemStatus() {
	var display = await aggregateSystemStatus();

	tty.write(`${display.projectName} \n\n`);
	tty.write(`Current Time: ${display.system.currentTimeHuman} \n`);
	tty.write(`OS: ${display.system.systemOS} \n`);
	tty.write(`System Load (1m): ${display.system.systemLoad} \n`);
	//Conversion string/setting should be taken from local DB
	//for loop that retrieves the first key in object.
	for(firstKey in display.system.caseTemperature) {
		tty.write(`Internal Case Temperature: \n`);
		if (Object.keys(display.system.caseTemperature[firstKey])[0] == 'reading') {
			tty.write(` SensorID: ${firstKey} - ${(core.temperatureConversion(Number(display.system.caseTemperature[firstKey]["reading"]), 'f')).toFixed(2)} F\n`);
		} else {
			tty.write(` SensorID: ${firstKey} - Unale to retrieve sensor data \n`);
		}
	}
	tty.write(`Hostname: ${display.system.hostname} \n`);
	tty.write(`Uptime: ${(display.system.uptime/60).toFixed()} Mins\n`);
	tty.write(`Momory: Free - ${(display.system.memoryFree/1000000).toFixed()} of ${(display.system.memoryTotal/1000000).toFixed()} MBs\n`);

	tty.write(`\nDisk Usage: \n`);

	tty.write(`\nNetwork Interface Information:\n`);

	tty.write(`\nTask Info:\n`);

	tty.write(`\nRelay Status:\n`);

	tty.write(`\nCurrent Tasks:\n`);

	tty.write(`\nScheduled Tasks:\n`);
}

//Run the code above every X secs
/*
async function test() {
	var test = await aggregateSystemStatus();
	//Calling a value of an object.
	//console.log(test.system["caseTemperature"]["28-011830a39bff"]["reading"]);
	console.log(JSON.stringify(test));
}
setInterval(function () {
	console.log('\033c');
	//Can be called to console directly using .then
	//aggregateSystemStatus().then(console.log);
	//Can be called within a async function
	test();
}, 2000);
*/
setInterval(function () {
	tty.write('\033c');
	displaySystemStatus();
}, 1500);
