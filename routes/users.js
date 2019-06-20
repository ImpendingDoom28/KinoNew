const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
// User model
const User = require('../models/User');

// Login Page
router.get('/login', (req, res) => res.render("login"));

// Register Page
router.get('/register', (req, res) => res.render("register")) ;

// Register Handle
router.post('/register', (req, res) => {
    const { name, email, password, passwordCheck } = req.body;
    let errors = [];
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
            errors, email, name, password
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
                        errors, email, name, password
                    });
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    });
                    // Hash Password
                    bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if(err) throw err;
                            //Set password to hashed password
                            newUser.password = hash;
                            //Save user
                            newUser.save()
                                .then(user => {
                                    res.redirect('/users/login');
                                })
                                .catch(err => console.log(err));
                        }))
                }
            });
    }
});

module.exports = router;