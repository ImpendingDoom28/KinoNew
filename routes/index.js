const express = require('express');
const router = express.Router();
const { checkIsLogged, checkIsNotLogged } = require('../config/auth');
//TODO Ринат, расскоменти и если ошибки - реши
const tmdb = require('tmdbv3').init(require('../config/keys').tmdbKey);

// simple logger for this router's requests
router.use((req, res, next) => {
    console.log('%s %s %s', req.method, req.url, req.path);
    next();
});

// Main page is the login page
router.get('/', checkIsNotLogged, (req, res) => res.redirect('/users/login'));

router.get('/home', checkIsLogged, (req, result) => {
    //TODO Ринат, вставлять сюда
    var information = [];
    tmdb.person.info(109, (err, res) => {

    });
    // res.render('home', {
    //         user: req.user
    //     });
    // }
});

module.exports = router;