const User = require('../models/User');
const BankAccount = require('../models/BankAccount');
const { validationResult } = require('express-validator');
const pool = require('../utils/pool');

const accounts = [
    {
        iban: "GB33BUKB20201555555555",
        cardnumber: "4242424242424242",
        cardtype: "visa",
        cvv: "721",
        expirydate: "02/25",
        balance: "10000",
        currency: "USD"
    },
    {
        iban: "DE89370400440532013000",
        cardnumber: "4000056655665556",
        cardtype: "visa_debit",
        cvv: "637",
        expirydate: "06/23",
        balance: "15000",
        currency: "USD"
    },
    {
        iban: "DE62370400440532013001",
        cardnumber: "5555555555554444",
        cardtype: "mastercard",
        cvv: "468",
        expirydate: "07/24",
        balance: "20000",
        currency: "USD"
    },
    {
        iban: "DE89370400440532013002",
        cardnumber: "5200828282828210",
        cardtype: "mastercard_debit",
        cvv: "551",
        expirydate: "10/26",
        balance: "25000",
        currency: "USD"
    }
];

// Controller for getting wallet balance
const getWalletBalance = async (req, res) => {
    try {
        // Check if the logged in user exists
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(401).json({
                msg: 'You cannot make use of this feature because you don\'t have an account on our database.',
                status: 'unauthorized',
                status_code: '401'
            });
        }
        const wallet = await pool.query('SELECT * FROM wallet WHERE user_id=$1',[req.user.id]);
        if (wallet.rows.length === 0) {
            return res.status(404).json({
                msg: 'You don\'t have a wallet connected to this account. Create a store to have your own wallet.',
                status: 'not found',
                status_code: '404'
            });
        }
        return res.status(200).json({
            status: 'success',
            status_code: '200',
            data: wallet.rows[0]
        });
    } catch (error) {
        // Return catched error response
        if (error) {
            return res.status(503).json({
                msg: 'Sorry we were unable to get retrieve your wallet balance at the moment. Please try again later, thank you.',
                status: 'service unavailable',
                status_code: '503'
            });
        }
    }
}

// Controller for transfering funds from wallet
const transferFund = async (req, res) => {
    // Check for errors in body request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {
        amount,
        accountname,
        accountiban
    } = req.body;
    try {
        // Check if the logged in user exists
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(401).json({
                msg: 'You cannot make use of this feature because you don\'t have an account on our database.',
                status: 'unauthorized',
                status_code: '401'
            });
        }
        const wallet = await pool.query('SELECT * FROM wallet WHERE user_id=$1', [req.user.id]);
        // Check if thee user has a wallet
        if (wallet.rows.length === 0) {
            return res.status(404).json({
                msg: 'You don\'t have a wallet connected to this account. Create a store to have your own wallet.',
                status: 'not found',
                status_code: '404'
            });
        }
        // Check if the amount the user is trying to withdraw is more than the users account balance
        if (parseFloat(amount) > parseFloat(wallet.rows[0].available_balance)) {
            return res.status(400).json({
                msg: 'You don\'t have enough balance in your account.',
                status: 'bad request',
                status_code: '400'
            });
        }
        // Check if the account iban is valid
        if (accounts.filter(account => account.iban === accountiban).length === 0) {
            return res.status(400).json({
                msg: 'The bank account you are trying to send money to is invalid.',
                status: 'bad request',
                status_code: '400'
            });
        }
        // Check if the bank account belongs to the logged in user
        const userBankAccount = await BankAccount.findOne({ user: req.user.id, accountiban, accountname });
        if (!userBankAccount) {
            return res.status(404).json({
                msg: 'You cannot perform this transaction because this bank account is not saved in your wallet.',
                status: 'bad request',
                status_code: '400'
            });
        }
        const newBalance = parseFloat(wallet.rows[0].available_balance) - parseFloat(amount);
        // Carry out transaction
        const transaction = await pool.query('UPDATE wallet SET available_balance=$1 WHERE user_id=$2',[newBalance, req.user.id]);
        if (transaction) {
            return res.status(200).json({
                msg: `Your transfer of $${amount} to ${accountname} was successful.`,
                status: 'success',
                status_code: '200'
            });
        }
    } catch (error) {
       // Return catched error response
       console.log(error);
       if (error) {
            return res.status(503).json({
                msg: 'Sorry we were unable to transfer your funds at the moment. Please try again later, thank you.',
                status: 'service unavailable',
                status_code: '503'
            });
        }
    }
}

module.exports = {
    getWalletBalance,
    transferFund
}