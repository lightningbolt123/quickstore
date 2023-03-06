require('dotenv').config();
const express = require('express');
const { check, body, validationResult } = require('express-validator');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceId = process.env.TWILIO_SERVICE_ID;
const secret = process.env.SECRET;
const client = require('twilio')(accountSid, authToken);
const smsVerification = require('../../utils/smsVerification');
const otpCheck = require('../../utils/otpCheck');
const auth = require('../../middlewares/auth');

// Destructure router method from the express microframework
const router = express.Router();

// @Route   GET api/auth
// @Desc    Route for loading user details from the auth token sent
// Access   Private
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(401).json({
                msg: 'You are not authorized to use this platform, please do sign up from the menu.',
                status: 'unauthorized',
                status_code: '401'
            });
        }
        return res.status(200).json({
            status: 'success',
            status_code: '200',
            data: user
        });
    } catch (error) {
        if (error) {
            return res.status(503).json({
                msg: 'Oops, something went wrong while we were trying to load your account details. Please try again later, thank you.',
                status: 'service unavailable',
                status_code: '503'
            });
        }
    }
});

// @Route   POST api/auth
// @Desc    Route for logging in
// @Access  Public
router.post('/', [
    check('email','Email is required').isEmail(),
    check('password','Password is required').not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req);

    // Check for errors in the body request
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Destructure email and password from request body
    const { email, password } = req.body;
    try {

        // Check if user with the email and password exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                msg: 'There is no account attached to this email on our platform. Please try another email or sign up for an account on our platform.',
                status: 'not found',
                status_code: '404'
            })
        }

        // Check if the password sent is the same as the user's password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ errors: [
                {
                    msg: 'You inputted the wrong password.',
                    status: 'bad request',
                    status_code: '400'
                }
            ]});
        }

        // Check if user account is active and send an otp to the user's phone number if the user's account is not active
        if (user.active === false) {
            try {
                const verification = await smsVerification(user.phonenumber);
                if (verification.status === 'pending') {
                    res.status(201).json({
                        msg: 'Your account is inactive so we sent you an otp to your phone for activating your account.',
                        status: 'created',
                        status_code: '201',
                        activation_status: 'pending',
                        data: {
                            countrycode: user.countrycode,
                            phonenumber: user.phonenumber
                        }
                    });
                }
            } catch (error) {
                console.log(error);
                if (error) {
                    return res.status(503).json({ errors: [
                        {
                            msg: 'Your account is not yet active and we encountered an error while trying to send you an activation otp. Please try again later, thank you.',
                            status: 'service unavailable',
                            status_code: '503'
                        }
                    ] });
                }
            }
        }

        // Create a payload object containing the user id
        const payload = {
            user: {
                id: user.id
            }
        }

        // Create a json token that will be used for logging in to the user's dashboard
        jwt.sign(payload, secret, {expiresIn:'7h'}, (error, token) => {
            if (error) {
                return res.status(500).json({ errors: [
                    {
                        msg: error.message,
                        status: 'server error',
                        status_code: '500'
                    }
                ] });
            }
            return res.status(200).json({
                status: 'success',
                status_code: '200',
                data: token
            })
        });
    } catch (error) {
        if (error) {
            console.log(error);
            return res.status(503).json({ errors: [
                {
                    msg: 'We encountered an error while trying to retrieve your login credentials. Please try again later, thank you.',
                    status: 'service unavailable',
                    status_code: '503'
                }
            ] });
        }
    }
});

module.exports = router;