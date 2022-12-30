const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phonenumber: {
        type: String,
        required: true
    },
    photo: {
        public_id: {
            type: String
        },
        secure_url: {
            type: String
        }
    },
    house: {
        type: String
    },
    street: {
        type: String
    },
    town: {
        type: String
    },
    postalcode: {
        type: Number
    },
    city: {
        type: String
    },
    country: {
        type: String
    },
    active: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = User = mongoose.model('user', UserSchema);