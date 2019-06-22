const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const googleKeys = require('./keys').google;
const { flashError } = require('../config/error-handler');

// Load GoogleUser model
const GoogleUser = require('../models/GoogleUser');

module.exports = (passport) => {
    passport.use(
        new GoogleStrategy({
            //Options for Google Strategy
            clientID: googleKeys.clientID,
            clientSecret: googleKeys.clientSecret,
            callbackURL: 'http://localhost:5000/auth/google/redirect'
        }, (accessToken, refreshToken, profile, done) => {
            // GoogleUser.findOrCreate({ googleId: profile.id, email: profile.emails[0].email, name: profile.name }, function (err, user) {
            //     console.log('New user was succesfully created with Google!!!');
            //     return done(err, user);
            // });
            //Passport callback function
            GoogleUser.findOne({googleID: profile.id})
                .then(user => {
                    if (user) {
                       return done(null, user);
                    } else {
                        console.log(profile);
                        console.log(profile.displayName);
                        console.log(profile.emails[0].value);
                        const newUser = new GoogleUser({
                            name: profile.displayName,
                            googleID: profile.id,
                            email: profile.emails[0].value
                        });
                        newUser.save()
                            .then(newUser => {
                                console.log('New user ' + newUser + ' was succesfully created!!!');
                                return done(null, user);
                            });
                    }
                })
                .catch((err) => console.log(err))
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((id, done) => {
        GoogleUser.findById(id).then((user) => {
            done(null, user);
        })
    });
};