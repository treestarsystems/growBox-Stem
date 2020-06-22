const express = require('express');
const router = express.Router();
const core = require('../../../modules/core.js');
const fs = require('fs');

/*
router.get('/', async (req,res) =>{
 let obj = req.body;
  
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
let interfacePassword = JSON.parse(data).interfacePassword;
console.log(interfacePassword)
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
*/

//Write file then check it on close then res.send based on if file exists.
router.post('/', async (req,res) =>{
 let obj = req.body;
 fs.readFile(core.coreVars.systemConfig, 'utf8', (err, data) => {
  if (err) {
   res.send({
    "status":"success",
    "message":"no",
    "messageExtended": err
   }).status(200);
  }
  if (data != '' && core.isJson(data)) {
   let interfacePassword = JSON.parse(data).interfacePassword;
   if (obj.password == interfacePassword) {
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

module.exports = router;
