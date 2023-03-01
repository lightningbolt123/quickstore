const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    user: {
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
            quantity: {
                type: Number
            },
            storeid: {
                type: String
            },
            total: {
                type: Number
            }
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Cart = mongoose.model('cart', CartSchema);