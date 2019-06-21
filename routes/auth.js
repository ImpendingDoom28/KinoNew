const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { forwardAuthenticated } = require('../config/auth');

router.get('/google',
    passport.authenticate('google', {
        scope: ['openid profile email']
    })
);
// Callback route for google to redirect to
router.get('/google/redirect', (req, res, next) => {
        passport.authenticate('google', {
            successRedirect: '/home',
            failureRedirect: '/users/login'
        })(req,res,next)
    }
);

module.exports = router;