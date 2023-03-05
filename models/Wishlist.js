const mongoose = require('mongoose');

const WishlistSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    items: [
        {
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
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Wishlist = mongoose.model('wishlist', WishlistSchema);