const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
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
        type: DOMStringList,
        required: true
    },
    favActors: {
        type: DOMStringList
    },
    countries: {
        type: DOMStringList
    },
    minRating: {
        type: Int8Array
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;