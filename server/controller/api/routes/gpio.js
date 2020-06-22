const express = require('express');
const router = express.Router();
const core = require('../../../modules/core.js');
const relay = require('../../../modules/relay.js');
const sensor = require('../../../modules/sensor.js');

router.post('/relay', async (req,res) => {
 let obj = req.body
 console.log(`Executing task: ${obj.task} for pin: #${obj.pin}`);
 if (obj.key == 'test') {
  res.send(relay.relayControl (Number(obj.pin), obj.task));
 } else {
  res.send({
   "status":"failure",
   "message":"Invalid key"
  });
 }
});

router.post('/water', async (req,res) => {
 let obj = req.body
 console.log(``);

});

router.post('/sensor', async (req,res) => {
 let obj = req.body
 if (obj.key == 'test') {
  if (obj.task == 'all') {
   await sensor.readSensorAllDS18B20(cb);
  } else if (obj.task == 'list') {
   await sensor.readSensorAllDS18B20(cb,true);
  } else {
   await sensor.readSensorSingleDS18B20(cb,obj.sensorID)
  }
 } else {
  res.send({
   "status":"failure",
   "message":"Invalid key"
  });
 }
 //Simplified callback wrapper to extract data async function
 function cb (d) {
  res.send(d)
 }
});

router.post('/status', async (req,res) => {
 let obj = req.body
 console.log(``);
});

module.exports = router;

