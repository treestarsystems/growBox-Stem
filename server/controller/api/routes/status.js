const express = require('express');
const router = express.Router();
const core = require('../../../modules/core.js');

router.get('/configured', async(req,res) =>{
 //Check if config file exists then send response.
 res.send({
  "status":"success",
  "message":"no"
 }).status(200);
});

module.exports = router;
