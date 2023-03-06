const Wishlist = require('../models/Wishlist');
const User = require('../models/User');
const { check, validationResult } = require('express-validator');

// Controller for adding items to wishlist
const addItemToWishlist = async (req, res) => {
    // Check for errors in body request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // Destructure wishlist details from the body request
    const { productname, productimage, productid, productprice } = req.body;
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
        // Creat new wishlist item
        let wish = await Wishlist.findOne({ owner: req.user.id });
        // Check if withlist exists for this user
        if (!wish) {
            wish = new Wishlist({
                owner: req.user.id,
                items: [{ productname, productimage, productid, productprice }]
            });
        } else {
            wish.items.unshift({ productname, productimage, productid, productprice });
        }
        // Save wishlist
        await wish.save();
        // Return the item
        const wishItem = wish.items.find(item => item.productid === productid);
        // Return success response
        return res.status(201).json({
            msg: 'You have successfully added this product to your wishlist for future reference. You can view your wishlist by clicking the wishlist icon on the menu.',
            status: 'created',
            status_code: '201',
            item: wishItem
        });        
    } catch (error) {
        // Return error if request fails
        if (error) {
            return res.status(503).json({
                msg: 'Sorry, we unable to add this product to your wishlist at the moment. Please try again later, thank you.',
                status: 'service unavailable',
                status_code: '503'
            });
        }
    }
}

const getWishlist = async (req, res) => {
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
        // Then fetch wishlist
        const wishlist = await Wishlist.findOne({ owner: req.user.id });
        if (!wishlist) {
            return res.status(404).json({
                msg: 'You don\'t have an item in your wishlist yet. Add one by  clicking the love sign on any product.',
                status: 'not found',
                status_code: '404'
            })
        }
        // Return wishlist
        return res.status(200).json({
            status: 'success',
            status_code: '200',
            data: wishlist.items
        });
    } catch (error) {
        console.log(error);
        // Return error if error exists
        if (error) {
            return res.status(503).json({
                msg: 'We are sorry we are unable to retrieve your wishlist at the moment, please try again later. Thank you.',
                status: 'service unavailable',
                status_code: '503'
            });
        }
    }
}

const removeItemFromWishlist = async (req, res) => {
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
        // Fetch the wishlist item
        const wishlist = await Wishlist.findOne({ owner: req.user.id });
        // Check if the item exists
        if (wishlist.items.filter(item => item.productid.toString() === req.params.id.toString()).length === 0) {
            return res.status(404).json({
                msg: 'The item you are trying to delete does not exist on our database.',
                status: 'not found',
                status_code: '404'
            });
        }
        // Create wish item removeIndex
        const removeIndex = wishlist.items.map(item => item.productid.toString()).indexOf(req.params.id.toString());
        wishlist.items.splice(removeIndex, 1);
        await wishlist.save();
        // Return success response
        return res.status(200).json({
            msg: 'You have successfully removed an item from your wishlist.',
            status: 'success',
            status_code: '200',
            id: req.params.id
        });
    } catch (error) {
       // Return error if error exists
       if (error) {
        console.log(error);
            return res.status(503).json({
                msg: 'We are sorry we are unable to remove this item from your wishlist at the moment. Please try again later. Thank you.',
                status: 'service unavailable',
                status_code: '503'
            });
        } 
    }
}

module.exports = {
    addItemToWishlist,
    getWishlist,
    removeItemFromWishlist
};