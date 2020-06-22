const express = require('express');
const router = express.Router();
const core = require('../../modules/core.js');

router.get('/', (req, res) => {
 res.render('status', {title: 'Status', layout: 'status'});
});

router.get('/setup', (req, res) => {
 res.render('setup', {title: 'Setup', layout: 'login'});
});

//Keep this as your final route
router.get('*', (req, res) => {
 res.redirect('/');
});

module.exports = router;
