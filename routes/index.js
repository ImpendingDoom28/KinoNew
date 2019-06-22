const express = require('express');
const router = express.Router();
const { checkIsLogged, checkIsNotLogged } = require('../config/auth');
//TODO Ринат, расскоменти и если ошибки - реши
const tmdb = require('tmdbv3').init(require('../config/keys').tmdbKey);

// Main page is the login page
router.get('/', checkIsNotLogged, (req, res) => res.redirect('/users/login'));

router.get('/home', checkIsLogged, (req, res) => {
    //TODO Ринат, вставлять сюда
    res.render('home', {
            user: req.user
        });
});

module.exports = router;