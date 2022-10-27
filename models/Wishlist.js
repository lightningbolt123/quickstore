const mongoose = require('mongoose');

const WishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    productname: {
        type: String,
        required: true
    },
    productid: {
        type: Number,
        required: true
    },
    productimage: {
        type: String
    },
    productprice: {
        type: Number
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Wishlist = mongoose.model('wishlist', WishlistSchema);