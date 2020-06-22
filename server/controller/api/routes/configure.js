const express = require('express');
const router = express.Router();
const core = require('../../../modules/core.js');
const fs = require('fs');

router.get('/', async (req,res) =>{
 //Check if config file exists then send response.
 fs.readFile(core.coreVars.systemConfig, 'utf8', (err, data) => {
  if (err) {
   res.send({
    "status":"success",
    "message":"no"
   }).status(200);
  } else {
   //Check if file is valid JSON and not an empty object
   if (data != '' && core.isJson(data) && data != JSON.stringify({}) ) {
    res.send({
     "status":"success",
     "message":"yes"
    }).status(200);
   } else {
    res.send({
     "status":"success",
     "message":"Invalid config. Please make correction(s)"
    }).status(200);
   }
  }
 });
});

router.post('/', async (req,res) =>{
 let config = req.body;
 if (!req.headers.referer) return res.send({"status": "failure","message":"No referer defined"})
 let referer = req.headers.referer.split('/');
 if (referer[referer.length-1] == 'setup' ) {
  //If it exists, check that it is valid JSON and not an empty object
  fs.readFile(core.coreVars.systemConfig, 'utf8', (err, data) => {
   if (err) {
    writeConfig(config,res);
   } else if (data == '' || !core.isJson(data) || data == JSON.stringify({}) ) {
    //If in valid then send them write data.
    writeConfig(config,res);
   } else {
    //If valid then send them to login.
    let currentInterfacePassword = config.currentInterfacePassword;
    let interfacePassword = JSON.parse(data).interfacePassword
    if (currentInterfacePassword == interfacePassword) {
     delete config.currentInterfacePassword;
     writeConfig(config,res);
    } else {
     res.send({
      "status": "failure",
      "message":"Invalid password.",
      "link": "/"
     }).status(200);
    }
   }
  });
 } else {
  //If the endpoint is not defined.
  res.send({
   "status": "failure",
   "message":"You're coming at me wrong!",
   "link": "/"
  }).status(200);
 }

 //Write file then check it on close then res.send based on if file exists.
 function writeConfig(configData,callback) {
  let configStream = fs.createWriteStream(core.coreVars.systemConfig,{encoding: 'utf8',mode: 0o600});
  configStream.write(JSON.stringify(configData, null, 2))
  //Check if config file exists then send response.
  configStream.close(() => {
   fs.access(core.coreVars.systemConfig, fs.constants.R_OK, (err) => {
    if (err) {
     callback.send({
      "status": "failure",
      "message":"Write Error. File does not exist.",
      "link": "/setup"
     }).status(200);
    } else {
     callback.send({
      "status": "success",
      "message":"yes",
      "link": "/login"
     }).status(200);
    }
   });
  });
 }
});

module.exports = router;
