const BankAccount = require('../models/BankAccount');
const User = require('../models/User');
const { validationResult } = require('express-validator');

const addBankAccount = async (req, res) => {
     // Check for errors in body request
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
     }
     // Destructure parameter from the request body
     const { bankname, accountname, accountiban, cardnumber } = req.body;
    try {
        // Check if the logged in user exists
        const user = await User.findById(req.user.id);
        if (!user) {
            // Return error message
            return res.status(401).json({
                msg: 'You cannot use this feature because you don\'t have an account on our database, please sign up on the menu.',
                status: 'unauthorized',
                status_code: '401'
            });
        }
        // First check if the user has already added bank accounts before
        let bank = await BankAccount.findOne({ owner: req.user.id });
        if (!bank) {
            bank = new BankAccount({
                owner: req.user.id,
                items: [{ bankname, accountname, accountiban, cardnumber }]
            });
        } else {
            if (bank.items.filter(item => item.accountiban === accountiban).length > 0) {
                return res.status(200).json({
                    msg: 'You have already saved a bank account with this IBAN.',
                    status: 'success',
                    status_code: '200'
                });
            }
            bank.items.unshift({ bankname, accountname, accountiban, cardnumber });
        }
        // Add bank account to database
        // const bank = new BankAccount({
        //     owner: req.user.id,
        //     bankname,
        //     accountname,
        //     accountiban,
        //     cardnumber
        // });
        // Save the bank account to the database
        await bank.save();
        return res.status(201).json({
            msg: 'Your bank details have been successfully added to our database.',
            status: 'created',
            status_code: '201',
            data: bank
        });
    } catch (error) {
        console.log(error);
        // Check for error and return error response
        if (error) {
            return res.status(503).json({
                msg: 'Sorry we are unable to add your bank account at the moment. Please try again later, thank you.',
                status: 'service unavailable',
                status_code: '503'
            });
        }
    }
}

const editBankAccount = async (req, res) => {
    // Check for errors in body request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // Destructure parameter from the request body
    const { bankname, accountname, accountiban, cardnumber } = req.body;
    try {
        // Fetch the bank account details with the url id from the database
        const bank = await BankAccount.findOne({ owner: req.user.id });
        // Check if the bank exists
        if (bank.items.filter(item => item._id.toString() === req.params.id).length === 0) {
            return res.status(404).json({
                msg: 'This bank details does not exist on our database.',
                status: 'not found',
                status_code: '404'
            });
        }
        const editedBank = {
            bankname,
            accountname,
            accountiban,
            cardnumber
        };
        // Update the bank account details
        bank.items = bank.items.map(item => item._id.toString() === req.params.id ? {...item, ...editedBank} : item);
        await bank.save();
        // Get the account details of the recently edited account
        const account = bank.items.find(item => item._id.toString() === req.params.id);
        // bank = await BankAccount.findByIdAndUpdate({ _id: req.params.id }, { bankname, accountname, accountiban, cardnumber }, { new: true });
        return res.status(201).json({
            msg: 'Your bank details was updated successfully.',
            status: 'created',
            status_code: '201',
            data: account
        });
    } catch (error) {
        console.log(error);
        // Check for error and return error response
        if (error) {
            return res.status(503).json({
                msg: 'Sorry we are unable to update your bank account at the moment. Please try again later, thank you.',
                status: 'service unavailable',
                status_code: '503'
            });
        }
    }
}

const getBankAccounts = async (req, res) => {
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
        // Fetch all bank accounts belonging to the logged in user
        const account = await BankAccount.findOne({ owner: req.user.id });
        // Success response
        return res.status(200).json({ status: 'success', status_code: '200', data: account.items });
    } catch (error) {
        // Check for error and return error response
        if (error) {
            return res.status(503).json({
                msg: 'Sorry we are unable to retrieve all your bank accounts at the moment. Please try again later, thank you.',
                status: 'service unavailable',
                status_code: '503'
            });
        }
    }
}

const getBankAccount = async (req, res) => {
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
        // Fetch the bank account
        const account = await BankAccount.findOne({ owner: req.user.id });
        // Check if the bank account exists
        if (account.items.filter(item => item._id.toString() === req.params.id).length === 0) {
            return res.status(404).json({
                msg: 'The bank account you are trying to retrieve does not exist.',
                status: 'not found',
                status_code: '404'
            });
        }
        const bank = account.items.find(item => item._id.toString() === req.params.id);
        // Return the account successfully
        return res.status(200).json({
            status: 'success',
            status_code: '200',
            data: bank
        });
    } catch (error) {
        // Return error if error if error is catched
        if (error) {
            return res.status(503).json({
                msg: 'We are unable to get this bank account details at the moment. Try again later, thank you.',
                status: 'service unavailable',
                status_code: '503'
            });
        }
    }
}

const deleteBankAccount = async (req, res) => {
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
        // Fetch the bank account
        const account = await BankAccount.findOne({ owner: req.user.id });
        // Check if the bank account exists
        if (account.items.filter(item => item._id.toString() === req.params.id).length === 0) {
            return res.status(404).json({
                msg: 'The bank account you are trying to delete does not exist.',
                status: 'not found',
                status_code: '404'
            });
        }
        const removeIndex = account.items.map(item => item._id.toString()).indexOf(req.params.id);
        account.items.splice(removeIndex, 1);
        await account.save();
        // Return success response
        return res.status(200).json({
            msg: 'Bank account deleted successfully.',
            status: 'success',
            status_code: '200',
            id: req.params.id
        });
    } catch (error) {
        // Return catched error response
        if (error) {
            return res.status(503).json({
                msg: 'Sorry we were unable to delete your bank details at the moment. Please try again later, thank you.',
                status: 'service unavailable',
                status_code: '503'
            });
        }
    }
}

module.exports = {
    addBankAccount,
    editBankAccount,
    getBankAccounts,
    getBankAccount,
    deleteBankAccount
};