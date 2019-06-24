const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { checkIsNotLogged } = require('../config/auth');
const { flashError } = require('../config/error-handler');

// User model
const User = require('../models/User');

// Login Page
router.get('/login', checkIsNotLogged, (req, res) => res.render('login'));

// Register Page
router.get('/register', checkIsNotLogged, (req, res) => res.render("register"));

// Register Handle
router.post('/register', (req, res) => {
    const { name, email, password, passwordCheck } = req.body;
    const errors = [];
    // Check password length
    if(password.length < 6) {
        errors.push({ msg: 'Пароль должен содержать минимум 6 символов'})
    }
    // Check passwords match
    if(password  !== passwordCheck) {
        errors.push({ msg: 'Пароли не совпадают!'});
    }

    if(errors.length > 0) {
        res.render('register', {
            errors, email, name, password, passwordCheck
        });
    } else {
        //Validation passed
        User.findOne({email: email})
            .then((user) => {
                if(user) {
                    // If User with given email exists
                    // rerender register page
                    errors.push({msg: 'Пользователь с почтой ' + email + ' уже существует!'});
                    res.render('register', {
                        errors, email, name, password, passwordCheck
                    });
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    });
                    // Hash Password
                    bcrypt.genSalt(10)
                        .then((salt) => {
                            bcrypt.hash(newUser.password, salt)
                                .then((hash) => {
                                    //Set password to hashed password
                                    newUser.password = hash;
                                    //Save user
                                    newUser.save()
                                        .then(user => {
                                            req.flash('success_msg', 'Вы успешно зарегистрировались и теперь можете авторизоваться');
                                            res.redirect('/users/login');
                                        })
                                        .catch(err => {
                                            flashError(req, res, err);
                                        })
                                })
                                .catch( err => {
                                    flashError(req, res, err);
                                })
                        })
                        .catch(err => {
                            flashError(req, res, err);
                        });
                }
            });
    }
});

// Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local',{
        successRedirect: '/account/settings',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);

});

//Logout Handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Вы вышли со своего аккаунта');
    res.redirect('/users/login');
});

module.exports = router;