#!/usr/bin/env node
/*
For growBox-Stem (Environment Controller)
Purpose - Output System Status Data to /dev/tty1 while
	  sending/receiving info to growBox-Root server.
Inputs  -
Action  -
Status  - Developing / Incomplete
*/

var os = require( 'os' );
var projectName = 'growBox - Stem (Environmental Control System)';
const disk = require('diskusage');
var timeOptions = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' };
//This should be retrieved from a local database. I think SQLite
var paths = [os.platform() === 'win32' ? 'c:' : '/', '/mnt/usb'];

//Example of converting time to human readable string
//var today  = new Date();
//"currentTime": today.toLocaleDateString("en-US", timeOptions);

//Collect Disk Data
function collectSystemStatusLocal() {
	var now  = Date.now();
	var nowHuman  = new Date(now);
	var collectedDataLocalDisks = collectSystemStatusDisks(paths);
	var collectedDataLocalInterfaces = collectSystemStatusInterfaces(os.networkInterfaces());
	var collectedDataLocal = {"currentTime": Date.now(),
				"currentTimeHuman": nowHuman.toLocaleDateString("en-US", timeOptions),
				"systemOS": os.type() + " " + os.release() + " " + os.arch(),
				//Gets 1 min load average
				"systemLoad": (os.loadavg()[0]).toFixed(2),
				"hostName": os.hostname(),
				"upTime": (os.uptime()/60).toFixed(),
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
function aggregateSystemStatus() {
	var collectedDataLocalSystem = collectSystemStatusLocal();
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
				"": ,
				"": ,
				"": ,
				"": ,
				"": ,
				"": ,
				"": ,
				"": ,
				}


	\nTask Info:`);
	 -growBox - Root (Task Master):`);
	 --Name: root-1fPUas `);
	 --IP Address: 19.168.1.1 `);
	 --Last Communication: ${lcommDate.toLocaleDateString("en-US", timeOptions)} `);
*/

	console.log(collectedData);
	return JSON.stringify(collectedData);
} 

//Sends locally collected data to the growBox-Root
function sendCollectedData() {

}

function displaySystemStatus() {
	var networkInterfaces = os.networkInterfaces();
	var timeOptions = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' };
	var today  = new Date();
	var lcommDate = new Date(1556776971000);

	console.log(`${projectName} \n`);
	console.log(`Current Time: ${today.toLocaleDateString("en-US", timeOptions)} `);
	console.log(`Hostname: ${os.hostname()} `);
	console.log(`Uptime: ${(os.uptime()/60).toFixed()} Mins`);
	console.log(`Total Momory: ${(os.totalmem()/1000000).toFixed()} MBs`);
	console.log(`\nDisk Usage: `);
	disk.check(path, function(err, info) {
		if (err) {
			console.log(err);
		} else {
			console.log(` -Path: ${path} `);
			console.log(` --Free: ${(info.available/1024000000).toFixed(2)} GBs`);
			console.log(` --Total: ${(info.free/1024000000).toFixed(2)} GBs`);
			console.log(` --Used: ${(100-((info.available/info.free)).toFixed(2)*100)}%`);
		}
	});
	console.log(`\nNetwork Interface Information:`);
	for (const [key, value] of Object.entries(networkInterfaces)) {
	i = 0;
		if (key != 'lo') {
			console.log(` -Name: ${key}: `);
			console.log(` --MAC: ${value[0]['mac']} `);
			console.log(`${value.forEach(
				function(element) {
					console.log(` --Address ${i}: ${element['cidr']} `);
					i++;
				})}`
			);
		}
	}

	//Added line until i figure out why undefined is being displayed.

	console.log(`\nRelay Status:`);
	console.log(`Relay #:	Pin #:	Status:	Description/Device:`);
	console.log(`-1		IO5	On	Reservoir Valve`);
	console.log(`-2		IO6	On	Ventilation Fans`);
	console.log(`-3		IO12	Off	Irrigation Pump`);
	console.log(`-4		IO13	On	Light 1`);
	console.log(`-5		IO19	Off	`);
	console.log(`-6		IO16	Off	`);
	console.log(`-7		IO26	Off	`);
	console.log(`-8		IO20	Off	`);

	console.log(`\nTask Info:`);
	console.log(` -growBox - Root (Task Master):`);
	console.log(` --Name: root-1fPUas `);
	console.log(` --IP Address: 19.168.1.1 `);
	console.log(` --Last Communication: ${lcommDate.toLocaleDateString("en-US", timeOptions)} `);

	console.log(`\nCurrent Tasks:`);
	console.log(` -Water: Reservoir Valve Open`);
	console.log(` -Light: On`);
	console.log(` -Air: On - Cooling to 72 F`);

	console.log(`\nScheduled Tasks:`);
	console.log(` -Water: Irrigation - On - ${today.toLocaleDateString("en-US", timeOptions)} `);
	console.log(` -Light: Off - ${today.toLocaleDateString("en-US", timeOptions)} `);
}

//Run the code above every 10 secs
setInterval(function () {
	console.log('\033c');
	console.log(aggregateSystemStatus());
}, 2000);
