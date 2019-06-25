const express = require('express');
const router = express.Router();
const {checkIsLogged, checkIsNotLogged} = require('../config/auth');
//TODO Ринат, расскоменти и если ошибки - реши
//const tmdb = require('tmdbv3').init(require('../config/keys').tmdbKey);

// Main page is the login page
router.get('/', checkIsNotLogged, (req, res) => res.redirect('/users/login'));

router.get('/home', checkIsLogged, (req, res) => {
    //TODO Ринат, вставлять сюда
    var request = require("request");

    var options = {
        method: 'GET',
        url: 'https://api.themoviedb.org/3/discover/movie',
        qs:
            {
                with_genres: '28',
                'vote_average.gte': '8',
                page: '1',
                include_video: 'false',
                include_adult: 'false',
                sort_by: 'popularity.desc',
                language: 'ru-Ru',
                api_key: 'f1bb885a34819055db8514823f6050a4'
            },
        body: '{}'
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        // console.log(body.page);
        let elem = JSON.parse(body);
        let results = elem.results;
        let movies = [];
        console.log(results);
        for (let i = 0; i < results.length; i++) {
            movies[i] = {
                id: results[i].id,
                title: results[i].title,
                genre: results[i].genre_ids,
                poster: results[i].poster_path,
                release_date: results[i].release_date,
                vote_average: results[i].vote_average,
                overview: results[i].overview
            }
        }
        movies.forEach(function(elem) {
            console.log(elem);
        });
    });

    res.render('home', {
        user: req.user
    });

});

module.exports = router;