const express = require('express');
const router = express.Router();

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
        res.send('pass!');
    }
});

module.exports = router;