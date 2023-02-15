const Cart = require('../models/Cart');
const User = require('../models/User');
const { validationResult } = require('express-validator');

const addItemToCart = async (req, res) => {
    // Check for errors in body request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // Destructure the request body
    const { productname, productimage, productprice, productquantity, productid } = req.body;
    try {
        // Fetch the user from the database
        const user = await User.findById(req.user.id);
        // Check if user exists
        if (!user) {
            // Return error message
            return res.status(401).json({
                msg: 'You need to have an account on our platform to use this feature. Please sign up from the menu.',
                status: 'unauthorized',
                status_code: '401',
                data: {
                    productname,
                    productimage,
                    productprice,
                    productquantity,
                    productid
                }
            });
        }
        // Create new cart item
        const item = new Cart({
            user: req.user.id,
            productname,
            productimage,
            productprice,
            productquantity,
            productid
        });
        // Save cart item
        await item.save()
        // Return success message
        return res.status(200).json({
            status: 'success',
            status_code: '200',
            data: item
        });
    } catch (error) {
        // Return error if request fails
        if (error) {
            return res.status(503).json({
                msg: 'Sorry, we are unable to add this product to your cart at the moment. Please try again later, thank you.',
                status: 'service unavailable',
                status_code: '503'
            });
        }
    }
}

const getCart = async (req, res) => {
    try {
        // Get user account
        const user = await User.findById(req.user.id);
        if (!user) {
            // Return error message if the user does not have an account
            return res.status(401).json({
                msg: 'You need to have an account with us to be able to use this feature.',
                status: 'unauthorized',
                status_code: '401'
            });
        }
        // Get cart
        const cart = await Cart.find({ user: req.user.id });
        // Check if cart exists
        if (!cart) {
            return res.status(200).json({
                status: 'success',
                status_code: '200',
                data: []
            });
        }
        // Return cart
        return res.status(200).json({
            status: 'success',
            status_code: '200',
            data: cart
        });
    } catch (error) {
        // Return error if request fails
        if (error) {
            return res.status(503).json({
                msg: 'Sorry, we are unable to retrieve your cart items at the moment. Please try again later, thank you.',
                status: 'service unavailable',
                status_code: '503'
            });
        }
    }
}

const removeItemFromCart = async (req, res) => {
    try {
        // First check if the user exists
        const user = await User.findById(req.user.id);
        if (!user) {
            // Return error message if the user does not have an account
            return res.status(401).json({
                msg: 'You need to have an account with us to be able to use this feature.',
                status: 'unauthorized',
                status_code: '401'
            });
        }
        // Fetch the cart item
        const item = await Cart.findById(req.params.id);
        // Check if the cart item exists
        if (!item) {
            return res.status(404).json({
                msg: 'The item you are trying to delete from your cart does not exist.',
                status: 'not found',
                status_code: '404'
            });
        }
        // Check if the logged in user is the owner of the cart
        if (item.user.toString() !== req.user.id) {
            return res.status(401).json({
                msg: 'You are not allowed to delete this itme from the cart because you are not the owner of the cart.',
                status: 'unauthorized',
                status_code: '401'
            })
        }
        await item.remove();
        return res.status(200).json({
            msg: 'You have successfully removed an item from your cart.',
            status: 'success',
            status_code: '200',
            id: req.params.id
        });
    } catch (error) {
        // Return error if request fails
        if (error) {
            return res.status(503).json({
                msg: 'Sorry, we are unable to remove this item from your cart at the moment. Please try again later, thank you.',
                status: 'service unavailable',
                status_code: '503'
            });
        }
    }
}
module.exports = {
    addItemToCart,
    getCart,
    removeItemFromCart
};