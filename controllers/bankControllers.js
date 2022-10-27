const BankAccount = require('../models/BankAccount');
const User = require('../models/User');
const { validationResult } = require('express-validator');

const addBankAccount = async (req, res) => {
     // Check for errors in body request
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.isArray() });
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
        // Add bank account to database
        const bank = new BankAccount({
            owner: req.user.id,
            bankname,
            accountname,
            accountiban,
            cardnumber
        });
        // Save the bank account to the database
        await bank.save();
        return res.status(201).json({
            msg: 'Your bank details have been successfully added to our database.',
            status: 'created',
            status_code: '201'
        });
    } catch (error) {
        // Check for error and return error response
        if (error) {
            return res.status(503).json({
                msg: 'Sorry we are unable to add your bank account at the moment. Please trya gaian later, thank you.',
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
        return res.status(400).json({ errors: errors.isArray() });
    }
    // Destructure parameter from the request body
    const { bankname, accountname, accountiban, cardnumber } = req.body;
    try {
        // Fetch the bank account details with the url id from the database
        let bank = await BankAccount.findById(req.params.id);
        // Check if the bank exists
        if (!bank) {
            return res.status(404).json({
                msg: 'The bank details with this id does not exist on our database.',
                status: 'not found',
                status_code: '404'
            });
        }
        if (bank.owner.toString() !== req.user.id) {
            return res.status(401).json({
                msg: 'You are not allowed to edit this bank details because you are not the owner of the account.',
                status: 'unauthorized',
                status_code: '401'
            });
        }
        // Update the bank account details
        bank = await BankAccount.findByIdAndUpdate({ _id: req.params.id }, { bankname, accountname, accountiban, cardnumber });
        return res.status(201).json({
            msg: 'Your bank details was updated successfully.',
            status: 'created',
            status_code: '201'
        });
    } catch (error) {
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
        const accounts = await BankAccount.find({ owner: req.user.id });
        // Check if the user has previously uploaded any bank account
        if (!accounts) {
            // Success response
            return res.status(200).json({ status: 'success', status_code: '200', data: accounts });
        } else {
            // Success response
            return res.status(200).json({ status: 'success', status_code: '200', data: accounts });
        }
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
        const account = await BankAccount.findById(req.params.id);
        // Check if the bank account exists
        if (!account) {
            return res.status(404).json({
                msg: 'The bank account you are trying to retrieve does not exist.',
                status: 'not found',
                status_code: '404'
            });
        }
        // Check if the logged in user is the owner of the account details
        if (account.owner.toString() !== req.user.id) {
            return res.status(401).json({
                msg: 'You cannot view this account details because you are not the owner of the account.',
                status: 'unauthorized',
                status_code: '401'
            });
        }
        // Return the account successfully
        return res.status(200).json({
            status: 'success',
            status_code: '200',
            data: account
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
        const account = await BankAccount.findById(req.params.id);
        // Check if the bank account exists
        if (!account) {
            return res.status(404).json({
                msg: 'The bank account you are trying to delete does not exist.',
                status: 'not found',
                status_code: '404'
            });
        }
        // Check if the logged in user is the owner of the account details
        if (account.owner.toString() !== req.user.id) {
            return res.status(401).json({
                msg: 'You cannot delete this bank account details because you are not the owner of the account.',
                status: 'unauthorized',
                status_code: '401'
            });
        }
        // Delete account
        await account.remove();
        // Return success response
        return res.status(200).json({
            status: 'success',
            status_code: '200'
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