const mongoose = require('mongoose');

const GoogleUserSchema = new mongoose.Schema({
    name: {
        type: String
    },
    googleID: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    favGenres: {
        type: String
    },
    favActors: {
        type: String
    },
    countries: {
        type: String
    },
    minRating: {
        type: Number
    }
});

const GoogleUser = mongoose.model('GoogleUser', GoogleUserSchema);

module.exports = GoogleUser;