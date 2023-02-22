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
    const total = parseInt(productprice) * parseInt(productquantity)
    try {
        // Fetch the user from the database
        const user = await User.findById(req.user.id);
        // Check if user exists
        if (!user) {
            // Return error message
            return res.status(401).json({
                msg: 'You need to have an account on our platform to use this feature. Please sign up from the menu.',
                status: 'unauthorized',
                status_code: '401'
            });
        }
        const cartItem = {
            productname,
            productimage,
            productprice,
            quantity: productquantity,
            productid,
            total
        };
        // Fetch user cart
        let cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            cart = new Cart({
                user: req.user.id,
                items: [cartItem]
            });
        } else if (cart && cart.items.filter(item => item.productid === productid).length > 0) {
            return res.status(200).json({
                msg: 'This item has already been added to your cart.',
                status: 'success',
                status_code: '200'
            });
        } else {
            cart.items.push(cartItem);
        }
        // Save cart
        await cart.save();
        // create data object
        const data = cart.items.find(item => parseInt(item.productid) === parseInt(productid));
        // Return success message
        return res.status(200).json({
            status: 'success',
            status_code: '200',
            data
        });
    } catch (error) {
        console.log(error);
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
        const cart = await Cart.findOne({ user: req.user.id });
        // Check if cart exists
        if (!cart || cart.items.length === 0) {
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
            data: cart.items
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
        const cart = await Cart.findOne({ user: req.user.id });
        // Check if the item exists in the user cart
        if (cart.items.filter(item => item._id.toString() === req.params.id).length === 0) {
            return res.status(404).json({
                msg: 'This item is not in your cart.',
                status: 'not found',
                status_code: '404',
            });
        }
        const removeIndex = cart.items.map(item => item._id.toString()).indexOf(req.params.id);
        cart.items.splice(removeIndex, 1);
        await cart.save();
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