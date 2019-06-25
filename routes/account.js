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

function isGenre(arrayToCheck) {
    console.log("array: " + '\'' + arrayToCheck +'\'');
    if(arrayToCheck !== '') {
        var request = require("request");
        var options = {
            method: 'GET',
            url: 'https://api.themoviedb.org/3/genre/movie/list',
            qs:
                {
                    language: 'ru-Ru',
                    api_key: 'f1bb885a34819055db8514823f6050a4'
                },
            body: '{}'
        };
        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            const genres = JSON.parse(body);
            arrayToCheck.forEach((item) => {
                let help = false;
                genres.genres.forEach(((genre) => {
                    if(item === genre.name) {
                        help = true;
                    }
                }));
                if(!help) {
                    return help;
                }
            });
        });
        return true;
    } else {
        return true;
    }

}

router.post('/settings', checkIsLogged, (req, res, next) => {
    const {favGenre, favActors, countries, minRating} = req.body;
    const errors = [];
    if(favGenre.length === 0 && favActors.length === 0) {
        errors.push({msg: 'Вы ничего не указали!'});
    } else {
        if(!isGenre(favGenre)) {
            errors.push({msg: 'Вы указали не допустимый жанр!'})
        }
    }
    if(errors.length > 0) {
        res.render('settings', {errors, minRating});
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
                        displayFavGenre:  user.favGenres,
                        displayFavActors: user.favActors,
                        displayCountries: user.countries,
                        displayMinRating: user.minRating
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

router.post('/settings/reset', (req, res, next) => {
    const user = req.user;
    const errors = [];
    console.log('Сбрасываем настройки...');
    User.findOne({email: user.email})
        .then((user) => {
            if(user) {
                console.log('Нашли пользователя');
                user.favGenres = [];
                user.favActors = [];
                user.countries = [];
                user.minRating = '';
                res.render('settings', {
                    success_msg : 'Ваши настройки успешно сброшены!',
                    displayFavGenre:  user.favGenres,
                    displayFavActors: user.favActors,
                    displayCountries: user.countries,
                    displayMinRating: user.minRating
                });
                console.log(user);
            } else {
                errors.push({msg: 'Произошла ошибка в базе данных сервера, пожалуйста, обратитесь в тех. поддержку'});
                res.render('settings', {
                    errors,
                    displayFavGenre:  user.favGenres,
                    displayFavActors: user.favActors,
                    displayCountries: user.countries,
                    displayMinRating: user.minRating
                });
            }
        })
        .catch((err) => {
            errors.push(err);
            res.render('settings', {
                errors,
                displayFavGenre:  user.favGenres,
                displayFavActors: user.favActors,
                displayCountries: user.countries,
                displayMinRating: user.minRating
            });
        });
});

module.exports = router;