const express = require('express');
const router = express.Router();
const { checkIsLogged, checkIsNotLogged } = require('../config/auth');

// simple logger for this router's requests
router.use((req, res, next) => {
    console.log('%s %s %s', req.method, req.url, req.path);
    next();
});

// Main page is the login page
router.get('/', checkIsNotLogged, (req, res) => res.redirect('/users/login'));

router.get('/home', checkIsLogged, (req, res) => {
    //TODO Ринат, вставлять сюда
    res.render('home', {
            user: req.user
        });
    }
);

module.exports = router;