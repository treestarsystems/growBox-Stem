const express = require('express');
const router = express.Router();
const core = require('../../modules/core.js');

router.get('/', (req, res) => {
 res.render('status', {title: 'Status', layout: 'login'});
});

router.get('/login', (req, res) => {
 res.render('login', {title: 'Login', layout: 'login'});
});

router.get('/setup', (req, res) => {
 res.render('setup', {title: 'Setup', layout: 'login'});
});

//Keep this as your final route
router.get('*', (req, res) => {
  res.send('nahhh bruh');
});

module.exports = router;
