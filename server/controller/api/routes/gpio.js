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
//   res.send(await sensor.readSensorAllDS18B20());
   await sensor.readSensorAllDS18B20(res,true);
  } else {
   let result = await sensor.readSensorSingleDS18B20(obj.sensorID)
   res.send(result);
//   res.send(await sensor.readSensorSingleDS18B20('28-011830a39bff'));
  }
 } else {
  res.send({
   "status":"failure",
   "message":"Invalid key"
  });
 }
});

router.post('/status', async (req,res) => {
 let obj = req.body
 console.log(``);
});

module.exports = router;

