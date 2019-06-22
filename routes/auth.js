const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { checkIsNotLogged } = require('../config/auth');

router.use((req, res, next) => {
    console.log('%s %s %s', req.method, req.url, req.path);
    next();
});

router.get('/google',
    passport.authenticate('google', {
        scope: ['openid profile email']
    })
);
// Callback route for google to redirect to
router.get('/google/redirect',
    passport.authenticate('google', {
            failureRedirect: '/users/login'
    }),
    (req, res) => {
        res.redirect('/home');
    }
);

module.exports = router;