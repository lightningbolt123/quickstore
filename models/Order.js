const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    customerid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    customerfirstname: {
        type: String,
        required: true
    },
    customerlastname: {
        type: String,
        required: true
    },
    customerphone: {
        type: String,
        required: true
    },
    goodspurchased: [
        {
            productid: {
                type: Number,
                required: true
            },
            status: {
                type: String,
                enum: ['processing','received','cancelled'],
                default: 'processing'
            },
            storeid: {
                type: Number,
                required: true
            },
            storename: {
                type: String,
                required: true
            },
            productname: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            cost: {
                type: Number,
                required: true
            }
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Order = mongoose.model('order', OrderSchema);