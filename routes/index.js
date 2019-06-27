const express = require('express');
const router = express.Router();
const {checkIsLogged, checkIsNotLogged} = require('../config/auth');

// Main page is the login page
router.get('/', checkIsNotLogged, (req, res) => res.redirect('/users/login'));

router.get('/home', checkIsLogged, (req, res) => {
    res.render('home', {user: req.user});
});

module.exports = router;