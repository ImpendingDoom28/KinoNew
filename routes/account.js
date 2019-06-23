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
    const {favGenre, favActors, countries, minRating} = req.body;
    console.log(req.body);
    User.findOne({email: req.user.email})
        .then((user) => {
            if(user) {
                // if(favGenres) {
                //     favGenres.forEach((item) => {
                //         if(item !== '') {
                //             user.favGenres.push(item);
                //         }
                //     });
                // }
                // if(favActors) {
                //     favActors.forEach((item) => {
                //         if(item !== '') {
                //             user.favActors.push(item);
                //         }
                //     });
                // }
                // if(countries) {
                //     countries.forEach((item) => {
                //         if(item !== '') {
                //             user.countries.push(item);
                //         }
                //     })
                // }
                user.minRating = minRating;
                console.log(user);
                res.render('settings', {favGenre, favActors, countries, minRating});
            }
        })
        .catch((err) => console.log(err));
});

module.exports = router;