#!/usr/bin/env node
/*
For GrowBox-Stem (Environment Controller)
Purpose - Output System Status Data to /dev/tty1:
Inputs  -
Action  -
*/

var fs  = require('fs');
var tty = fs.createWriteStream('/dev/tty1');
var os = require( 'os' );
var projectName = 'GrowBox - Stem (Environmental Control System)';
const disk = require('diskusage');
let path = os.platform() === 'win32' ? 'c:' : '/';

function displaySystemStatus() {
	var networkInterfaces = os.networkInterfaces();

	tty.write(`${projectName} \n\n`);
	tty.write(`Current Time: ${Date()} \n`);
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
}

//Run the code above every 10 secs
setInterval(function () {
	tty.write('\033c');
	displaySystemStatus();
}, 10000);
