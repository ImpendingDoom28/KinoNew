const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const googleKeys = require('./keys').google;

// Load User model
const User = require('../models/User');

module.exports = (passport) => {
    passport.use(
        new GoogleStrategy({
            //Options for Google Strategy
            clientID: googleKeys.clientID,
            clientSecret: googleKeys.clientSecret,
            callbackURL: '/auth/google/redirect'
        }, (accessToken, refreshToken, profile, done) => {
            //Passport callback function
            User.findOne({email: profile.email}
                .then(user => {
                    if (!user) {
                        new User({
                            name: profile.displayName,
                            email: profile.emails[0].email,
                            password: ''
                        }).save().then(newUser => {
                            console.log('New user ' + newUser + ' was succesfully created!!!');
                        });
                    } else {
                        return done(null, false, {message: "Пользователь не существует"});
                    }
                    console.log(profile);
                    console.log(profile.displayName);
                    console.log(profile.emails[0].email);
                })
            );
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user);
    });
    passport.deserializeUser((user, done) => {
        done(null, user);
    });
};