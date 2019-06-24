const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { checkIsLogged } = require('../config/auth');

const User = require('../models/User');

router.get('/settings', checkIsLogged, (req, res, next) => {
    res.render('settings', {user: req.body.user});
});
router.post('/settings', checkIsLogged, (req, res, next) => {
    const {favGenre, favActors, countries, minRating} = req.body;
    const errors = [];
    console.log(req.body);
    if(favGenre.length === 0) {
        errors.push({msg: 'Вы не указали ни одного жанра!'});
    }
    if(favActors.length === 0) {
        errors.push({msg: 'Вы не указали ни одного актёра!'});
    }
    if(errors.length > 0) {
        res.render('settings', {errors, favGenre, favActors, countries, minRating});
    } else {
        User.findOne({email: req.user.email})
            .then((user) => {
                if(user) {
                    if(favGenre) {
                        favGenre.forEach((item) => {
                            // if(item !== '') {
                            //     user.favGenres.push(item);
                            // }
                            console.log(item);
                        });
                    }
                    if(favActors) {
                        favActors.forEach((item) => {
                            // if(item !== '') {
                            //     user.favActors.push(item);
                            // }
                            console.log(item);
                        });
                    }
                    if(countries) {
                        // countries.forEach((item) => {
                        //     if(item !== '') {
                        //         user.countries.push(item);
                        //     }
                        // })
                    }
                    user.minRating = minRating;
                    console.log(user);
                    req.flash('success_msg', 'Ваши настройки сохранены!');
                    res.render('settings', {displayFavGenre: favGenre, displayFavActors:favActors, displayCountries: countries, displayMinRating: minRating});
                } else {
                    errors.push({msg: 'Произошла ошибка в базе данных сервера, пожалуйста, обратитесь в тех. поддержку'});
                    res.render('settings', {errors, favGenre, favActors, countries, minRating});
                }
            })
            .catch((err) => {
                errors.push({msg: err});
                res.render('settings', {errors});
            });
    }
});

module.exports = router;