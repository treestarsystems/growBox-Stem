const express = require('express');
const router = express.Router();
const core = require('../../../modules/core.js');
const fs = require('fs');

router.get('/', async(req,res) =>{
 //Check if config file exists then send response.
 fs.readFile(core.coreVars.systemConfig, 'utf8', (err, data) => {
  if (err) {
   res.send({
    "status":"success",
    "message":"no"
   }).status(200);
  } else {
   //Check if file is valid JSON
   if (data != '' && core.isJson(data)) {
    res.send({
     "status":"success",
     "message":"yes"
    }).status(200);
   } else {
    res.send({
     "status":"success",
     "message":"invalid"
    }).status(200);
   }
  }
 });
});

router.post('/', async(req,res) =>{
 //Check if config file exists then send response.
 res.send({
  "status": "success",
  "message":"no"
 }).status(200);
});

module.exports = router;
