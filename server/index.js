const express = require('express');
const fs = require('fs');
const app = express();
const daemon = require('./service.js');
const emoji = require('node-emoji');
const compression = require('compression');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const cors = require('cors');
const childProcess = require('child_process');
const path = require('path');
const core = require('./modules/core.js');
const jobs = require('./modules/cronJobs.js').jobs;

app.use(compression());
// View engine setup
app.set('views', path.join(__dirname, "view/pages"));
app.engine('handlebars', exphbs({
 defaultLayout: 'main',
 extname: '.handlebars',
 layoutsDir:'server/view/pages/layouts',
 partialsDir:'server/view/pages/partials'
}));

app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors());

/*
//API Endpoints
const gpio = require('./controller/api/routes/gpio');
app.use('/api/gpio', gpio);
*/
const status = require('./controller/api/routes/status');
app.use('/api/status', status);
const configure = require('./controller/api/routes/configure');
app.use('/api/configure', configure);

//Pages
const pages = require('./controller/pages/pages');
app.use('/', pages);

//Create required directories and change permissions if they do not exist.
//These should be mounted to a large storage pool
if (!fs.existsSync(core.coreVars.installedDir)){
 core.createDir (core.coreVars.installedDir);
}

function startApp () {
 app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(`${emoji.emojify(':heavy_check_mark:.....:100:')}`);
  //Write daemon data as a json object to a file so it can be called later.
  daemon.instanceInfo(process.env.pm_id,process.env.name,process.env.NODE_APP_INSTANCE,process.env.NODE_ENV);
 });
}

//Check if app is runing as correct user then execute.
core.incorrectUser(process.env.USER,process.env.HOST,process.env.PORT);
if (process.env.CORRECT_USER) {
 //Start app.
 startApp();
 //Start all cron jobs defined in ./server/modules/cronJobs.js
 for (key in jobs) {
  jobs[key].start();
 }
}
