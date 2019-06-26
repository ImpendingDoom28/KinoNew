const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const open =  require('open');

const app = express();

//Passport config
const localPassport = require('./config/passport')(passport);

//Google passport config
const googlePassport = require('./config/passport-google')(passport);

//DB Config
const db = require('./config/keys').MongoURI;

//Public directory
app.use(express.static(__dirname + '/public'));

//Connect to MongoDB
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => {
        console.log('MongoDB Connected....');
        init();
    })
    .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Bodyparser
app.use(express.urlencoded({ extended: true}));

// Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
// IMPORTANT: Passport middleware should ALWAYS be after Express session
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

// Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.movies = req.flash('movies');
    next();
});

// Routes
app.use('/users', require('./routes/users'));
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/account', require('./routes/account'));

function init() {
    app.listen(PORT, console.log(`Server started on port ${PORT}`));
}

app.use((req, res, next) => {
    console.log('%s %s %s', req.method, req.url, req.path);
    next();
});

(async () => {
    await open('http://localhost:5000/users/login');
})();
