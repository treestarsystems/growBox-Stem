/*
 A place for defining all cron jobs
 I split this from the controller/cron/cron.js to maintain structure although its annoying as fuck.
 FORGIVE ME!!!!
*/
var cronJob = require('cron').CronJob;
var customCron = require('../controller/cron/cron.js');
var jobs = {};

//Define cron jobs. May move this to another file at some point.
/*
jobs['allDevicesImport'] = new cronJob(
 '0 05 0 * * *',
 customCron.allDevicesImport,
 null,
 false,
 'America/New_York'
);
*/
module.exports = {
 jobs
}
