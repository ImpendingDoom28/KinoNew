const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    favGenres: {
        type: [String]
    },
    favGenresIDs: {
        type: [Number]
    },
    favActors: {
        type: [String]
    },
    favActorsIDs: {
        type: [Number]
    },
    countries: {
        type: [String]
    },
    minRating: {
        type: Number
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;