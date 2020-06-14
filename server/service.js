#!/usr/bin/env node

/*
Purpose: Collects information about the running process to make it easier to stop,
	 delete, and restart.
ToDo:    Make this all async....man fuck all dat
*/

const fs = require('fs');
const fsSync = require('fs');
const core = require('./modules/core.js');
const childProcess = require('child_process');
var argv = require('minimist')(process.argv.slice(2));

function instanceInfo (id,name,instance,environment) {
 var info = {};
 info.id = id;
 info.name = name;
 info.pid = fsSync.readFileSync(`${core.coreVars.logStoreDir}/pid/${core.coreVars.projectName}_id-${id}.pid`).toString();
 info.instance = instance;
 info.environment = environment;
 let data = JSON.stringify(info, null, 2);
 fs.writeFile(`${core.coreVars.logStoreDir}/pid/${core.coreVars.projectName}_Kill.json`, data, (err) => {
  if (err) throw err;
 });
}

if (argv.k) {
 let instanceId = require(`${core.coreVars.logStoreDir}/pid/${core.coreVars.projectName}_Kill.json`);
// childProcess.execSync(`pm2 stop ${instanceId.id}`);
 childProcess.execSync(`pm2 stop all`);
}
if (argv.s) {
 let instanceId = require(`${core.coreVars.logStoreDir}/pid/${core.coreVars.projectName}_Kill.json`);
// childProcess.execSync(`pm2 status ${instanceId.id}`);
 childProcess.execSync(`pm2 status all`);
}
if (argv.d) {
 let instanceId = require(`${core.coreVars.logStoreDir}/pid/${core.coreVars.projectName}_Kill.json`);
// childProcess.execSync(`pm2 delete ${instanceId.id}`);
 childProcess.execSync(`pm2 delete all`);
}
if (argv.r) {
 let instanceId = require(`${core.coreVars.logStoreDir}/pid/${core.coreVars.projectName}_Kill.json`);
// childProcess.execSync(`pm2 restart ${instanceId.id}`);
 childProcess.execSync(`pm2 restart all`);
}

module.exports = {
 instanceInfo,
}
