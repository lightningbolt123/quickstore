const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    username: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    message: {
        type: String,
        required: true
    },
    rating: {
        type: String,
        required: true
    },
    productid: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Review = mongoose.model('review', ReviewSchema);