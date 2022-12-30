require('dotenv').config();
const express = require('express');
const { check, body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../../models/User');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceId = process.env.TWILIO_SERVICE_ID;
const secret = process.env.SECRET;
const client = require('twilio')(accountSid, authToken);
const smsVerification = require('../../utils/smsVerification');
const otpCheck = require('../../utils/otpCheck');
const auth = require('../../middlewares/auth');
const { cloudinary } = require('../../utils/cloudinary');

const router = express.Router();

// @Route   POST api/users
// @Desc    Route for registering a new user
// @Access  Public
router.post('/', [
    check('firstname','Firstname field cannot be empty.').not().isEmpty(),
    check('lastname','Lastname field cannot be empty.').not().isEmpty(),
    check('email','Email field must conatin a valid email address.').isEmail(),
    check('password','Password cannot be less than 8 characters long.').isLength({ min:8 }),
    check('house','House number cannot be empty.').not().isEmpty(),
    check('street','Street cannot be empty.').not().isEmpty(),
    check('town','Town cannot be empty.').not().isEmpty(),
    check('city','City cannot be empty.').not().isEmpty(),
    check('postalcode','Postalcode only takes in numeric values.').isNumeric().isLength({ min:3 }),
    check('country','Country cannot be empty.').not().isEmpty(),
    check('phonenumber','Phone number cannot be empty.').not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req);

    // Check for errors in the body request
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Destructure the user details from the body request
    const {
        firstname,
        lastname,
        email,
        password,
        house,
        street,
        town,
        city,
        postalcode,
        country,
        phonenumber
    } = req.body;
    try {

        // Get user account with that email address
        const emailExists = await User.findOne({ email });

        // Get user account with that phone number
        const phonenumberExists = await User.findOne({ phonenumber });

        // Check if user with the email address exists
        if (emailExists) {
            return res.status(401).json({
                errors: [
                    {
                        msg: 'User with this email address already exists on our system, please try signing up with another email address.',
                        status: 'unauthorized',
                        status_code: '401'
                    }
                ]
            });
        }

        // Check if user with the phone number exists
        if (phonenumberExists) {
            return res.status(401).json({
                errors: [
                    {
                        msg: 'User with this phone number already exists, please try signing up with another phone number.',
                        status: 'unauthorized',
                        status_code: '401'
                    }
                ]
            });
        }

        // Create user object
        const user = new User({
            firstname,
            lastname,
            email,
            house,
            street,
            town,
            city,
            postalcode,
            country,
            phonenumber
        });

        try {
            // Send OTP to the user's phone number for completing registration
            const verification = await smsVerification(phonenumber);

            // Check the status of the verification service
            if (verification.status === 'pending') {
                // Encrypt user password
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(password, salt);
                
                // Save user account and return success response
                await user.save();
                return res.status(200).json({
                    msg: 'Your account has been created successfully but there is one more step to complete your registration before your account can be acctive. Check your phone for the OTP we sent to you to complete your signup process.',
                    data: phonenumber,
                    status: 'processing request',
                    status_code: '200'
                });
            }
        } catch (error) {
            if (error) {
                // Return error if the OTP fails to deliver
                return res.status(503).json({
                    errors: [
                        {
                            msg: 'We were unable to send you an OTP due to an error we encountered. Please try to register again later, thank you.',
                            status: 'service unavailable',
                            status_code: '503'
                        }
                    ]
                });
            }
        }
    } catch (error) {
        if (error) {
            // Return error if the server encounters an error while creating or fetching user account details
            return res.status(503).json({
                errors: [
                    {
                        msg: 'We encountered an error while we were trying to create your account. Please try again later, thank you.',
                        status: 'service unavailable',
                        status_code: '503'
                    }
                ]
            });
        }
    }
});

// @Route   POST api/users/verifyaccount/:countrycode/:phonenumber
// @Desc    This is the route for verifying and activating a user's account with the OTP they received upon signup
// @Access  Public
router.post('/verifyaccount', [
    check('otp','The otp must be of numerical value.').isNumeric().isLength({ min:6 }),
    check('phonenumber','The phone number cannot be empty be empty.').not().isEmpty()
], async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json(error);
    }
    const { otp, phonenumber } = req.body;
    try {
        let user = await User.findOne({ phonenumber });

        // Check if user with the phone number exists
        if (!user) {
            return res.status(404).json({
                errors: [
                    {
                        msg: 'You don\'t have an account with us. Signup and start using our features.',
                        status: 'not found',
                        status_code: '404'
                    }
                ]
            });
        }
        try {
             // Send verification code to the user's phone number
            await otpCheck(phonenumber, otp);
            // Activate user account
            await User.findOneAndUpdate({ phonenumber }, { active: true }, { new: true });
            // Return success response
            return res.status(200).json({
                msg: 'Your account has been activated successfully. You can now login and start making use of our features.',
                status: 'activation successful',
                status_code: '200'
            });
        } catch (error) {
            if (error) {
                console.log(error.message);
                return res.status(503).json({
                    errors: [
                        {
                            msg: 'We encountered an error while we were trying to verify the otp you sent. Please resend the otp and try again later, thank you.',
                            status: 'service unavailable',
                            status_code: '503'
                        }
                    ]
                });
            }
        }
    } catch (error) {
        if (error) {
            console.log(error);
            return res.status(503).json({
                errors: [
                    {
                        msg: 'We encountered an error while we were trying to retrieve your account details. Please try again later, thank you.',
                        status: 'service unavailable',
                        status_code: '503'
                    }
                ]
            });
        }
    }
});

// @Route   POST api/users/resend_otp
// @Desc    Route for resending otp
// @Access  Public
router.post('/resend_otp', [
    check('countrycode','Country code cannot be empty.').isNumeric().isLength({ min:1 }),
    check('phonenumber','Phone number requires a minimum of eight numerical values.').isNumeric().isLength({ min:8 })
],async (req, res) => {
    // Check body request for errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { countrycode, phonenumber } = req.body;
    try {
        // Send otp to mobile number
        const verification = await smsVerification(countrycode, phonenumber);
        // Check the sms verification status and return sucess message if successful
        if (verification.status === 'pending') {
            return res.status(200).json({
                msg: 'The otp was resent successfully, check your mobile phone for the otp.',
                status: 'success',
                status_code: '200'
            });
        }
    } catch (error) {
        // return error if the sms service fails with an error
        if (error) {
            return res.status(503).json({
                errors: [
                    {
                        msg: 'We are unable to resend your otp at the moment. Please try again later, thank you.',
                        status: 'service unavailable',
                        status_code: '503'
                    }
                ]
            });
        }
    }
});

// @Route   POST api/users/retrieve_password
// @Desc    Route for retrieving user forgotten password
// @Access  Public
router.post('/retrieve_password', [
    check('countrycode','Country code must contain a minimum of 1 digit.').isNumeric().isLength({ min: 1 }),
    check('phonenumber','Phone number must be of numerical value.').isNumeric().isLength({ min:7 })
], async (req, res) => {
    const errors = validationResult(req);

    // Check for errors in body request
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // Destructure countrycode and phonenumber from the request body object
    const { countrycode, phonenumber } = req.body;
    try {

        // Check if user with the email address exists
       const user = await User.findOne({ countrycode: parseInt(countrycode), phonenumber: parseInt(phonenumber) });
       if (!user) {
        return res.status(404).json({
            msg: 'User account with this phone number does not exist. Please try another phone number or signup for a new account on our menu.',
            status: 'not found',
            status_code: '404',
            data: user
        });
       }

       // Send verification code to the user's phone number
       const verification = await smsVerification(user.countrycode, user.phonenumber);

       try {
        // Check the status of the verification service
        if (verification.status === 'pending') {
            return res.status(200).json({
                msg: 'We just sent an OTP to your phone number. Please, check your mobile inbox.',
                status: 'sms sent',
                status_code: '200',
                data: {
                    countrycode,
                    phonenumber
                }
            });
        }
       } catch (error) {
        // Check the status of the verification service
        if (error) {
            console.log(error);
            return res.status(503).json({
                msg: 'We were unable to send you an sms now due to an error we encountered. Please try again later, thank you.',
                status: 'service unavailable',
                status_code: '503'
            });
        }
       }

    } catch (error) {

        // Return error when there is a server failure
        if (error) {
            console.log(error);
            return res.status(503).json({
                msg: 'Sorry we are unable to retrieve your account details at the moment. Please try again later, thank you.',
                status: 'service unavailable',
                status_code: '503'
            });
        }
    }
});


// @Route   POST api/users/generatetoken
// @Desc    Route for generating token for password retrieval after the otp has been verified
// @Access  Public
router.post('/generatetoken', [
    check('otp','OTP is required.').isNumeric().isLength({ min:5 }),
    check('countrycode','Country code must contain a minimum of 1 digit.').isNumeric().isLength({ min:1 }),
    check('phonenumber','Phone number cannot be empty.').isNumeric().isLength({ min:7 })
], async (req, res) => {
    // Check for errors in the body request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // Destructure the otp from the body request
    const { otp, countrycode, phonenumber } = req.body;
    try {
        // Get user with the phone number and country code
        const user = await User.findOne({ countrycode: parseInt(countrycode), phonenumber: parseInt(phonenumber) });
        
        // Check if the user exists and return an error if the user does not exist
        if (!user) {
            return res.status(404).json({
                errors: [
                    {
                        msg: 'Account with this phonenumber does not exist on our platform. Please try another phone number or signup for a new account.',
                        status: 'not found',
                        status_code: '404'
                    }
                ]
            });
        }

        try {
            // Verify otp
            const verified = await otpCheck(countrycode, phonenumber, otp);
            // Check otp verification status
            if (verified.status === 'approved') {
                // Create a payload object containing the user id
                const payload = {
                    user: {
                        id: user.id
                    }
                }

                // Create a json token that will be used for creating the user's new password
                jwt.sign(payload, secret, {expiresIn:'1h'}, (error, token) => {
                    // Return error if the server encounters an error while generating the token
                    if (error) {
                        return res.status(500).json({
                            errors: [
                                {
                                    msg: 'We encountered an error while trying to generate token. Please try again later.',
                                    status: 'server error',
                                    status_code: '500'
                                }
                            ]
                        });
                    }
                    // Return token
                    return res.status(200).json({
                        errors: [
                            {
                                status: 'token.success',
                                status_code: '200',
                                data: token
                            }
                        ]
                    });
                });
            } else {
                return res.status(200).json({
                    errors: [
                        {
                            msg: 'We were unable to verify the otp you sent. Please try resending the otp and try again, thank you.',
                            status: 'token.failed',
                            status_code: '200'
                        }
                    ]
                });
            }
        } catch (error) {
            // Return error if the token verification service failed
            if (error) {
                return res.status(503).json({
                    errors: [
                        {
                            msg: 'We encountered an error while trying to verify your otp. Please try again later.',
                            status: 'service unavailable',
                            status_code: '503'
                        }
                    ]
                });
            }
        }
    } catch (error) {
        // Check for error while fetching user id
        if (error) {
            return res.status(503).json({
                errors: [
                    {
                        msg: 'Sorry we are unable to generate a token for your password retrieval at the moment. Please try again later, thank you.',
                        status: 'service unavailable',
                        status_code: '503'
                    }
                ]
            });
        }
    }
});

// @Route   POST api/users/newpassword/:token
// @Desc    Route for creating new password
// @Access  Public
router.post('/newpassword/:token', body('newpassword').not().isEmpty(), async (req, res) => {

    // Check for errors in body request
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json(error.errors[0]);
    }

    // Destructure the new password from the body request
    const { newpassword } = req.body;
    try {

        // Decode the token sent along with the request and extract the user id from it
        const decoded = jwt.verify(req.params.token, secret);
        const id = decoded.user.id;

        // Check if there is an account with that user id
        let user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                msg: 'This account does not exist, please sign up for a new account on our menu.',
                status: 'not found',
                status_code: '404'
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(newpassword, salt);

        // Update user password and return a success response
        user.password = password;
        await user.save();
        return res.status(200).json({
            msg: 'Your password was changed successfully, you can now log in with your new password.',
            status: 'success',
            status_code: '200'
        });
    } catch (error) {

        // Check for errors while fetching user details
        if (error) {
            console.log(error);
            return res.status(500).json({
                msg: 'Oops, something went wrong. We were unable to set the new password for your account. Please try again later, thank you.',
                status: 'server error',
                status_code: '500'
            });
        }
    }
});

// @Route   PUT api/users/account
// @Desc    Route for editing user account details
// @Access  Private
router.put('/account', [
    auth,
    [
        check('firstname','Firstname field cannot be empty').not().isEmpty(),
        check('lastname','Lastname field cannot be empty').not().isEmpty(),
        check('email','Email field cannot be empty').not().isEmpty(),
        check('countrycode','Country code cannot be empty').not().isEmpty(),
        check('phonenumber','Phone number must be a numeric value').isNumeric().isLength({ min:8 })
    ]
], async (req, res) => {
    const errors = validationResult(req);

    // Check for errors in the body request
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Destructure the user details from the body request
    const {
        firstname,
        lastname,
        email,
        house,
        street,
        city,
        postalcode,
        country,
        countrycode,
        phonenumber
    } = req.body;
    try {

        // Create user account object
        const userObject = {};
        userObject.firstname = firstname;
        userObject.lastname = lastname;
        userObject.email = email;
        userObject.countrycode = countrycode;
        userObject.phonenumber = phonenumber;
        if (house) userObject.house = house;
        if (street) userObject.street = street;
        if (city) userObject.city = city;
        if (postalcode) userObject.postalcode = postalcode;
        if (country) userObject.country = country;
        // Search for user on the database
        let user = await User.findById(req.user.id);
        // Return error if the user does not exist
        if (!user) {
            return res.status(404).json({
                msg: 'The account you are trying to edit does not exist on our platform. Please signup for an account on our menu.',
                status: 'not found',
                status_code: '404'
            });
        }
        // Update user details on the database
        user = await User.findByIdAndUpdate(req.user.id, userObject);
        // Return success message
        return res.status(201).json({
            msg: 'You have successfully updated your account.',
            status: 'created',
            status_code: '201'
        });
    } catch (error) {
        // Return error if the server was unable to retrieve the user details from the database
        if (error) {
            return res.status(500).json({
                msg: 'Oops, something went wrong while trying to update your account details. Please try again later, thank you.',
                status: 'server error',
                status_code: '500'
            });
        }
    }
});

// @Route   POST /api/users/change_password
// @Desc    Route for changing password within the dashboard
// @Access  Private
router.post('/change_password', [
    auth,
    body('password','Password must contain a minimum of eight characters.').isLength({ min: '8' })
], async (req, res) => {
    // Check for error in body request
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json(error.errors[0]);
    }
    // Destructure the password from the body
    const { password } = req.body;
    try {
        // Retrieve user account details
        let user = await User.findById(req.user.id);
        // Check if user exists and return an error if their account does not exist
        if (!user) {
            return res.status(404).json({
                msg: 'You don\'t have an account on our platform.',
                status: 'not found',
                status_code: '404'
            });
        }
        // Generate salt for hashing password
        const salt = await bcrypt.genSalt(10);
        // Update user password with the hashed password
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        // Return success message
        return res.status(201).json({
            msg: 'Your password was updated successfully.',
            status: 'created',
            status_code: '201'
        });
    } catch (error) {
        // Return error if server fails to retrieve or update user details
        if (error) {
            return res.status(503).json({
                msg: 'We are unable to change your password at the moment. Please try again later, thank you.',
                status: 'service unavailable',
                status_code: '503'
            });
        }
    }
});

// @Route   POST api/users/photo
// @Desc    Route for uploading and updating user's profile picture
// @Access  Private
router.post('/photo', [
    auth,
    body('photo','Photo object cannot be empty.').not().isEmpty()
], async (req, res) => {
    // Check for error in body request
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json(error.errors[0]);
    }
    // Destructure the photo from the body object
    const { photo } = req.body;
    try {
        // Fetch user account details
        let user = await User.findById(req.user.id);
        // Return error if user account does not exist
        if (!user) {
            return res.status(404).json({
                msg: 'You don\'t have an account on our platform.',
                status: 'not found',
                status_code: '404'
            });
        }
        try {
            // Check if the user's account already has a photo
            if (!user.photo.public_id) {
                // Upload photo
                const uploadPicture = await cloudinary.v2.uploader.upload(photo, { folder: 'quickstore', resource_type: 'auto' });
                // Create photo object to be saved on the user database
                const photoObject = {
                    public_id: uploadPicture.public_id,
                    secure_url: uploadPicture.secure_url
                };
                // Update user account
                user = await User.findByIdAndUpdate({ _id: req.user.id }, { photo: photoObject });
                // Return success message
                return res.status(201).json({
                    msg: 'Your profile photo was uploaded successfully.',
                    status: 'created',
                    status_code: '201'
                });
            } else {
                await cloudinary.v2.uploader.upload(photo, { public_id: user.photo.public_id.toString() });
                return res.status(201).json({
                    msg: 'Your profile photo was updated successfully.',
                    status: 'created',
                    status_code: '201'
                });
            }
        } catch (error) {
            if (error) {
                return res.status(503).json({
                    msg: 'Sorry we are unable to upload your profile picture at the moment. Please try again later, thank you.',
                    status: 'service unavailable',
                    status_code: '503'
                });
            }
        }
    } catch (error) {
        // Return error if the server fails to get user detail or update user details
        if (error) {
            return res.status(503).json({
                msg: 'We are unable to update your profile photo at the moment. Please try again later.',
                status: 'service unavailable',
                status_code: '503'
            });
        }
    }
});

// @Route   DELETE api/users/photo
// @Desc    Route for deleting user profile photo
// @Access  Private
router.delete('/photo', auth, async (req, res) => {
    try {
        // First fetch the user account
        let user = await User.findById(req.user.id);
        // Check if the user account is available
        if (!user) {
            return res.status(404).json({
                msg: 'You don\'t have an account with our platform.',
                status: 'not found',
                status_code: '404'
            });
        }
        // Check if the photo public_id exists and return an error if it was not found
        if (!user.photo.public_id) {
            return res.status(404).json({
                msg: 'You don\'t have a profile photo to delete.',
                status: 'not found',
                status_code: '404'
            });
        }
        // Delete profile photo
        await cloudinary.v2.uploader.destroy(user.photo.public_id, { asset_folder: 'quickstore' });
        // Update the user account info
        user = await User.findByIdAndUpdate({ _id: req.user.id }, { photo: { public_id: "", secure_url: "" }});
        return res.status(200).json({
            msg: 'Your profile photo was deleted successfully.',
            status: 'success',
            status_code: '200'
        });
    } catch (error) {
        // Check if there is an error with the remote services and return an error message
        if (error) {
            return res.status(503).json({
                msg: 'Sorry, we are unable to delete your photo at the moment. Please try again later, thank you.',
                status: 'service unavailable',
                status_code: '503'
            })
        }
    }
});

module.exports = router;