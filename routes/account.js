const express = require('express');
const router = express.Router();
const passport = require('passport');
const { checkIsLoggedGoogle, checkIsLogged } = require('../config/auth');

router.use((req, res, next) => {
    console.log('%s %s %s', req.method, req.url, req.path);
    next();
});
router.get('/settings', checkIsLogged, (req, res, next) => {
    res.render('settings', {user: req.body.user});
});

router.post('/settings', (req, res, next) => {
    res.send('hello');
});

module.exports = router;