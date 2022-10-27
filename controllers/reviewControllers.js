const Review = require('../models/Review');
const User = require('../models/User');
const { validationResult } = require('express-validator');

const addProductReview = async (req, res) => {
    // Check for errors in the body request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // Destructure parameters from body request
    const { message, rating, productid } = req.body;
    try {
        // First fetch the user account
        const user = await User.findById(req.user.id);
        // Check if the user exists
        if (!user) {
            // Return error message if the user does not have an account
            return res.status(401).json({
                msg: 'You need to have an account with us to be able to use this feature.',
                status: 'unauthorized',
                status_code: '401'
            });
        }
        // Create an avatar variable
        let avatar;
        // Check if the user avatar exists and update it with the user avatar url
        if (user.photo.secure_url) {
            avatar = user.photo.secure_url;
        } else {
            avatar = "";
        }
        // Create new review
        const review = new Review({
            user: req.user.id,
            username: `${user.firstname}${user.lastname}`,
            avatar,
            message,
            rating,
            productid
        });
        // Save review
        await review.save();
        // Return success response
        return res.status(201).json({
            message: 'Your review has been submitted successfully.',
            status: 'created',
            status_code: '201'
        });
    } catch (error) {
        // Return error if server requests fails
        if (error) {
            console.log(error);
            // Return error statement
            return res.status(503).json({
                msg: 'Sorry we are unable to submit your review at the moment. Please try again later, thank you.',
                status: 'service unavailable',
                status_code: '503'
            });
        }
    }
}

const getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ productid: req.params.product_id });
        if (reviews.length === 0) {
            return res.status(200).json({
                status: 'success',
                status_code: '202',
                data: []
            });
        } else {
            return res.status(200).json({
                status: 'success',
                status_code: '202',
                data: reviews
            });
        }
    } catch (error) {
        if (error) {
            return res.status(503).json({
                msg: 'Sorry we are unanle to retrieve the reviews for this product at the moment. Please try again later, thank you.',
                status: 'service unavialable',
                status_code: '503'
            });
        }
    }
}

module.exports = {
    addProductReview,
    getProductReviews
}