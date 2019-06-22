const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
const { checkIsLogged } = require('../config/auth');
const { flashError } = require('../config/error-handler');

const User = require('../models/User');

router.get('/settings', checkIsLogged, (req, res, next) => {
    res.render('settings', {user: req.body.user});
});

router.post('/settings', checkIsLogged, (req, res, next) => {
    //TODO забирать с каждого поля информацию и изменять параметры юзера
    let {favGenres, favActors, countries, minRating} = req.body;
    User.findOne({email: req.user.email})
        .then((user) => {
            if(user) {
                user.favGenres = favGenres;
                user.favActors = favActors;
                user.countries = countries;
                user.minRating = minRating;
                res.render('settings');
                console.log('settings post done');
                console.log(user);
            }
        })
        .catch((err) => flashError(req, res, err));
});

module.exports = router;