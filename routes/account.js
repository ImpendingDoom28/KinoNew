const express = require('express');
const router = express.Router();
const { checkIsLogged } = require('../config/auth');
const request = require("sync-request");
const User = require('../models/User');

router.get('/settings', checkIsLogged, (req, res, next) => {
    res.render('settings', {user: req.user});
});

const options = {qs: {language: 'ru-Ru', api_key: 'f1bb885a34819055db8514823f6050a4'}};
const urlGenres = 'https://api.themoviedb.org/3/genre/movie/list';
const req = request('GET', urlGenres, options);

function isUnique(toCheck, array) {
    array.forEach((item) => {
        if(item === toCheck) {
            return false;
        }
    });
    return true;
}

function isGenre(arrayToCheck) {
    if(arrayToCheck !== '' || arrayToCheck.length > 0) {
        let bigIsGenre = true;
        const genres = JSON.parse(req.getBody());
        arrayToCheck.forEach((item) => {
            if(item !== '') {
                let isGenre = false;
                genres.genres.forEach((genre) => {
                    if(item === genre.name) {
                        isGenre = true;
                    }
                });
                if(isGenre === false) {
                    bigIsGenre = isGenre;
                }
            }
        });
        return bigIsGenre;
    } else {
        if(arrayToCheck === '') {
            return false;
        }
    }
}
function getGenreId(genre) {
    const id = [];
    const genres = JSON.parse(req.getBody());
    genres.genres.forEach((actualGenre) => {
        if (genre === actualGenre.name) {
            console.log('id from request: ' + actualGenre.id);
            id.push(actualGenre.id);
        }
    });
    return id;
}

router.post('/settings', checkIsLogged, (req, res, next) => {
    const {favGenres, favActors, minRating} = req.body;
    const errors = [];
    console.log(favGenres);
    if(favGenres.length === 0 && favActors.length === 0) {
        errors.push({msg: 'Вы не указали любимых актёров или любимые жанры!'});
    } else {
        if(!isGenre(favGenres)) {
            errors.push({msg: 'Вы указали не допустимый жанр!'});

        }
    }
    const type = typeof parseInt(minRating);
    if(type !== "number") {
        errors.push({msg: 'Минимальный рейтинг должен быть числом!'});
    } else {
        if((parseInt(minRating) < 1 || parseInt(minRating) > 10) && minRating !== '') {
            errors.push({msg: 'Минимальный рейтинг должен быть в пределах от 1 до 10!'});
        }
    }
    if(errors.length > 0) {
        res.render('settings', {errors, user:req.user, favGenres, favActors, minRating});
    } else {
        const newFavGenres = [];
        const newFavGenresIDs = [];
        const newFavActors = [];
        let newMinRating;
        if(favGenres.length > 0) {
            favGenres.forEach((item) => {
                if(item !== '' && isUnique(item, req.user.favGenres)) {
                    const id = getGenreId(item);
                    newFavGenres.push(item);
                    newFavGenresIDs.push(id[0]);
                }
            });
        }
        if(favActors.length > 0) {
            favActors.forEach((item) => {
                if(item !== '' && isUnique(item, req.user.favActors)) {
                    newFavActors.push(item);
                }
            });
        }
        if(req.user.minRating === null) {
            newMinRating = parseInt(minRating);
        }
        User.findOneAndUpdate({email: req.user.email}, {favGenres: newFavGenres, favActors: newFavActors, favGenresIDs: newFavGenresIDs, minRating: newMinRating}, null,
            (err, user) => {
                if(err) {
                    errors.push(err);
                    res.render('settings', {errors, user:user});
                }
            })
            .then((user) => {
                res.render('settings', {success_msg: 'Ваши настройки успешно сохранены!', user: user})
            });
    }
});

router.post('/settings/reset', (req, res, next) => {
    const user = req.user;
    const errors = [];
    console.log('Сбрасываем настройки...');
    User.findOneAndUpdate({email: user.email}, { favGenres: [], favGenresIDs: [], favActors: [], minRating: null}, null,
        (err, user) => {
            if(err) {
                errors.push({msg: 'Произошла ошибка в базе данных сервера, пожалуйста, обратитесь в тех. поддержку'});
                res.render('settings', {
                    errors,
                    user: user
                });
            }
         })
        .then((user) => {
            res.render('settings', {
                success_msg : 'Ваши настройки успешно сброшены!',
                user: user
            });
        })
});

module.exports = router;