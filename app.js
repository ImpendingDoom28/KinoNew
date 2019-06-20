const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');

const app = express();

//DB Config
const db = require('./config/keys').MongoURI;

//Connect to Mongo
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected....'))
    .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Routes
app.use('/users', require('./routes/users'));

app.listen(PORT, console.log(`Server started on port ${PORT}`));