const express = require('express');
const router = express.Router();
const core = require('../../../modules/core.js');
const status = require('../../../modules/status.js');

router.get('/', async(req,res) =>{
 //Check if config file exists then send response.
 let statusObj = await status.sendCollectedData();
 res.send(statusObj);
});

module.exports = router;
