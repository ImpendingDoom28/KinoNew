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
        type: []
    },
    favActors: {
        type: [String]
    },
    favActorsIDs: {
        type: []
    },
    minRating: {
        type: "number"
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;