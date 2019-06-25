const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { checkIsLogged } = require('../config/auth');

const User = require('../models/User');

router.get('/settings', checkIsLogged, (req, res, next) => {
    res.render('settings', {user: req.body.user});
});

function isUnique(toCheck, array) {
    array.forEach((item) => {
        if(item === toCheck) {
            return false;
        }
    });
    return true;
}

router.post('/settings', checkIsLogged, (req, res, next) => {
    const {favGenre, favActors, countries, minRating} = req.body;
    const errors = [];
    if(favGenre.length === 0 && favActors.length === 0) {
        errors.push({msg: 'Вы ничего не указали!'});
    }
    if(errors.length > 0) {
        res.render('settings', {errors, favGenre, favActors, countries, minRating});
    } else {
        User.findOne({email: req.user.email})
            .then((user) => {
                if(user) {
                    if(favGenre.length > 0) {
                        favGenre.forEach((item) => {
                            if(item !== '' && isUnique(item, user.favGenres)) {
                                user.favGenres.push(item);
                            }
                        });
                    }
                    if(favActors.length > 0) {
                        favActors.forEach((item) => {
                            if(item !== '' && isUnique(item, user.favActors)) {
                                user.favActors.push(item);
                            }
                        });
                    }
                    if(countries.length > 0) {
                        countries.forEach((item) => {
                            if(item !== '' && isUnique(item, user.countries)) {
                                user.countries.push(item);
                            }
                        });
                    }
                    if(user.minRating === '') {
                        user.minRating = minRating;
                    }
                    console.log(user);
                    res.render('settings', {
                        success_msg:"Ваши настройки успешно сохранены!",
                        displayFavGenre: favGenre,
                        displayFavActors:favActors,
                        displayCountries: countries,
                        displayMinRating: minRating
                    });
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