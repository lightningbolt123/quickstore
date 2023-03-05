const mongoose = require('mongoose');

const BankAccountSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    items: [
        {
            bankname: {
                type: String,
                required: true
            },
            accountname: {
                type: String,
                required: true
            },
            accountiban: {
                type: String,
                required: true
            },
            cardnumber: {
                type: Number,
                required: true
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

module.exports = BankAccount = mongoose.model('bankaccount', BankAccountSchema);