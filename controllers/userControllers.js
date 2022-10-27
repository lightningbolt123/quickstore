const User = require('../models/User');

const getUserById = async (id, res) => {
    try {
        const user = await User.findById(id).select('-password');
        if (!user) {
            return res.status(404).json({
                msg: 'The user you are searching for does not exist.',
                status: 'not found',
                status_code: '404'
            });
        }
        return user;
    } catch (error) {
        if (error) {
            return res.status(503).json({
                msg: 'Sorry we are unable to retrieve this user details at the moment. Please try again later, thank you.',
                status: 'service unavailable',
                status_code: '503'
            });
        }
    }
}

const userEmailExists = async (email, res) => {
    try {
        const user = await User.findOne({ email });
        if (user) {
            return res.status(401).json({
                msg: 'A user with this email address already exists.',
                status: 'success',
                status_code: '401'
            });
        }
    } catch (error) {
        if (error) {
            return res.status(503).json({
                msg: 'Sorry we are unable to retrieve this user details at the moment. Please try again later, thank you.',
                status: 'service unavailable',
                status_code: '503'
            });
        }
    }
}

const verifyLoggedInUser = async (id, res) => {
    try {
        const user = await User.findById(id).select('-password');
        if (!user) {
            return res.status(401).json({
                msg: 'You don\'t have an account on our database.',
                status: 'unauthorized',
                status_code: '401'
            });
        }
        return user;
    } catch (error) {
        if (error) {
            return res.status(503).json({
                msg: 'Sorry we are unable to retrieve your account details at the moment. Please try again later, thank you.',
                status: 'service unavailable',
                status_code: '503'
            });
        }
    }
}

module.exports = {
    getUserById,
    userEmailExists,
    verifyLoggedInUser
}