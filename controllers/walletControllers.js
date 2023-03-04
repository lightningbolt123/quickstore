const User = require('../models/User');
const { validationResult } = require('express-validator');
const pool = require('../utils/pool');

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
                msg: 'Sorry we were unable to delete your bank details at the moment. Please try again later, thank you.',
                status: 'service unavailable',
                status_code: '503'
            });
        }
    }
}

module.exports = {
    getWalletBalance
}