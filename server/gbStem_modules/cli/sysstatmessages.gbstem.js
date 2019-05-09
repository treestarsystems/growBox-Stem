#!/usr/bin/env node
/*
For GrowBox-Stem (Environment Controller)
Purpose - Output System Status Data to /dev/tty1:
Inputs  -
Action  -
Status  - Developing / Incomplete
*/

var fs  = require('fs');
var tty = fs.createWriteStream('/dev/tty1');
var os = require( 'os' );
var projectName = 'growBox - Stem (Environmental Control System)';
const disk = require('diskusage');
let path = os.platform() === 'win32' ? 'c:' : '/';

function displaySystemStatus() {
	var networkInterfaces = os.networkInterfaces();
	var timeOptions = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' };
	var today  = new Date();
	//Variables like this will be retireved from task master then converted later on in the script.
	var lcommDate = new Date(1556776971000);

	tty.write(`${projectName} \n\n`);
	tty.write(`Current Time: ${today.toLocaleDateString("en-US", timeOptions)} \n`);
	tty.write(`Hostname: ${os.hostname()} \n`);
	tty.write(`Uptime: ${(os.uptime()/60).toFixed()} Mins\n`);
	tty.write(`Total Momory: ${(os.totalmem()/1000000).toFixed()} MBs\n`);
	tty.write(`\nDisk Usage: \n`);
	disk.check(path, function(err, info) {
		if (err) {
			tty.write(err);
		} else {
			tty.write(` -Path: ${path} \n`);
			tty.write(` --Free: ${(info.available/1024000000).toFixed(2)} GBs\n`);
			tty.write(` --Total: ${(info.free/1024000000).toFixed(2)} GBs\n`);
			tty.write(` --Used: ${(100-((info.available/info.free)).toFixed(2)*100)}%\n`);
		}
	});
	tty.write(`\nNetwork Interface Information:\n`);
	for (const [key, value] of Object.entries(networkInterfaces)) {
	i = 0;
		if (key != 'lo') {
			tty.write(` -Name: ${key}: \n`);
			tty.write(` --MAC: ${value[0]['mac']} \n`);
			tty.write(`${value.forEach(
				function(element) {
					tty.write(` --Address ${i}: ${element['cidr']} \n`);
					i++;
				})}`
			);
		}
	}

	//Added line until i figure out why undefined is being displayed.
	tty.write(`\n`);
	tty.write(`\nTask Info:\n`);
	tty.write(` -growBox - Root (Task Master):\n`);
	tty.write(` --Name: root-1fPUas \n`);
	tty.write(` --IP Address: 19.168.1.1 \n`);
	tty.write(` --Last Communication: ${lcommDate.toLocaleDateString("en-US", timeOptions)} \n`);

	tty.write(`\nCurrent Tasks:\n`);
	tty.write(` -Water: Reservoir Valve Open\n`);
	tty.write(` -Light: On\n`);
	tty.write(` -Air: On - Cooling to 72 F\n`);

	tty.write(`\nScheduled Tasks:\n`);
	tty.write(` -Water: Irrigation - On - ${today.toLocaleDateString("en-US", timeOptions)} \n`);
	tty.write(` -Light: Off - ${today.toLocaleDateString("en-US", timeOptions)} \n`);
}

//Run the code above every 10 secs
setInterval(function () {
	tty.write('\033c');
	displaySystemStatus();
}, 10000);
