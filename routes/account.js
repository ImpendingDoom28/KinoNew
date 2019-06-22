const express = require('express');
const router = express.Router();
const passport = require('passport');
const { checkIsNotLogged } = require('../config/auth');

router.use((req, res, next) => {
    console.log('%s %s %s', req.method, req.url, req.path);
    next();
});

router.get('/settings', checkIsNotLogged, (req, res) =>
    res.render('settings', {
        user: req.user
    })
);

module.exports = router;