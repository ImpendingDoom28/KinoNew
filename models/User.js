const mongoose = require('mongoose');

const SearchObject = {
    id: Number,
    name: String
};
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
        type: [SearchObject]
    },
    favActors: {
        type: [SearchObject]
    },
    countries: {
        type: [SearchObject]
    },
    minRating: {
        type: Number
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;