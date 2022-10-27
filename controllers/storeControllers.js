const User = require('../models/User');
const pool = require('../utils/pool');
const { validationResult } = require('express-validator');
const { cloudinary } = require('../utils/cloudinary');

const getAllStores = async (req, res) => {
    try {
        // Get all stores on the platform
        const stores = await pool.query('SELECT * FROM store ORDER BY store_id ASC');
        if (stores.rows.length > 0) {
            // Return json response
            return res.status(200).json({ status: 'success', status_code: '200', data: stores.rows });
        } else {
            // Return json response
            return res.status(200).json({ status: 'success', status_code: '200', data: [] });
        }
    } catch (error) {
        // Return error if the server was unable to fetch all stores successfully
        if (error) {
            return res.status(503).json({
                msg: 'We wre unable to retrieve all stores at the moment. Please try again later, thank you.',
                status: 'service unavailable',
                status_code: '503'
            });
        }
    }
}

const getSingleStoreById = async (req, res) => {
    try {
        // Fetch store data from the database
        const store = await pool.query('SELECT * FROM store WHERE store_id=$1', [req.params.id]);
        if (store.rows.length > 0) {
            // Return json response
            return res.status(200).json({
                status: 'success',
                status_code: '200',
                data: store.rows[0]
            });
        } else {
            // Return json response
            return res.status(404).json({
                msg: 'The store you are searching for does not exist.',
                status: 'not found',
                status_code: '404'
            });
        }
    } catch (error) {
        // Check for error in fetching store data
        if (error) {
            return res.status(503).json({
                msg: 'Sorry we are unable to retrieve the store data at the moment. Please try again later, thank you.',
                status: 'service unavailable',
                status_code: '503'
            });
        }
    }
}

const getLoggedInUserStoreById = async (req, res) => {
    try {
        // Fetch the logged in user sotre data from the database
        const store = await pool.query('SELECT * FROM store WHERE seller_id=$1', [req.user.id]);
        // Check if the store exists
        if (store.rows.length === 0) {
            return res.status(404).json({
                msg: 'You don\'t yet have a store on this platform. Please create one from the menu.',
                status: 'not found',
                status_code: '404'
            });
        } else {
            // Return store
            return res.status(200).json({
                status: 'success',
                status_code: '200',
                data: store.rows[0]
            });
        }
    } catch (error) {
        // Check for error in fetching store data
        if (error) {
            console.log(error);
            return res.status(503).json({
                msg: 'Sorry we are unable to retrieve your store data at the moment. Please try again later, thank you.',
                status: 'service unavailable',
                status_code: '503'
            });
        }
    }
}

const createOrUpdateStore = async (req, res) => {
    // Check for errors in body request and return error response if errors exist
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // Destructure 
    const { name, shop_url, house, street, postalcode, city, country } = req.body;
    try {
        // Check if user exists
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(401).json({
                msg: 'You are not allowed to create a store because you do not have an account on our platform. Please signup from the menu.',
                status: 'unauthorized',
                status_code: '401'
            });
        }
        // Check if the user already has a store on the platform
        let store = await pool.query('SELECT * FROM store WHERE seller_id=$1', [req.user.id]);
        if (store.rows.length === 0) {
            // Create store if the store does not exist
            store = await pool.query('INSERT INTO store (seller_id, name, shop_url, house, street, postalcode, city, country) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *', [
                req.user.id,
                name,
                shop_url,
                house,
                street,
                postalcode,
                city,
                country
            ]);
            // Create wallet
            await pool.query('INSERT INTO wallet (user_id, available_balance, ledger_balance, currency, store_id) VALUES ($1,$2,$3,$4,$5)', [
                req.user.id,
                parseFloat(0).toFixed(2),
                parseFloat(0).toFixed(2),
                'USD',
                store.rows[0].store_id
            ]);
            // Return success message
            return res.status(201).json({
                msg: 'Your store was created successfully.',
                status: 'created',
                status_code: '201'
            });
        } else {
            // Update store details
            pool.query('UPDATE store SET name=$1, shop_url=$2, house=$3, street=$4, postalcode=$5, city=$6, country=$7 WHERE seller_id=$8', [
                name,
                shop_url,
                house,
                street,
                postalcode,
                city,
                country,
                req.user.id
            ]);
            // Return success response
            return res.status(201).json({
                msg: 'Your store data has been updated successfully.',
                status: 'created',
                status_code: '201'
            });
        }
    } catch (error) {
        // Check for error in fetching user account details and in the store creation process
        if (error) {
            console.log(error);
            return res.status(503).json({
                msg: 'Sorry we encountered an error while fetching and updating your store details. Please try again later, thank you.',
                status: 'service unavailable',
                status_code: '503'
            })
        }
    }
}

const uploadStoreIcon = async (req, res) => {
    // Check for error in body request
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json(error.errors[0]);
    }
    // Destructure the photo data from the body of request
    const { icon } = req.body;
    try {
        // Fetch store details
        const store = await pool.query('SELECT * FROM store WHERE seller_id=$1',[req.user.id]);
        // Check if store exists
        if (store.rows.length === 0) {
            return res.status(404).json({
                msg: 'You don\'t yet have a store on our platform. Please create one from our menu.',
                status: 'not found',
                status_code: '404'
            });
        }
        // Check if icon exists before uploading or updating it
        if (!store.rows[0].icon || !store.rows[0].icon.public_id) {
            // Upload icon to cloud
            const uploadPicture = await cloudinary.v2.uploader.upload(icon, { folder: 'quickstore', resource_type: 'auto'});
            // Create photo object
            const photoObject = {
                public_id: uploadPicture.public_id,
                secure_url: uploadPicture.secure_url
            };
            // Update user store details
            await pool.query('UPDATE store SET icon=$1 WHERE seller_id=$2', [photoObject, req.user.id]);
            return res.status(201).json({
                msg: 'You have successfully uploaded your store icon.',
                status: 'created',
                status_code: '201'
            });
        } else {
            // Update icon
            await cloudinary.v2.uploader.upload(icon, { public_id: store.rows[0].icon.public_id.toString() });
            return res.status(201).json({
                msg: 'You have successfully updated your store icon',
                status: 'created',
                status_code: '201'
            });
        }
    } catch (error) {
        // Check for error in fetching user account details and in the store creation process
        if (error) {
            console.log(error);
            return res.status(503).json({
                msg: 'Sorry we encountered an error while uploading your store photo. Please try again later, thank you.',
                status: 'service unavailable',
                status_code: '503'
            });
        }
    }
}

const deleteStoreIcon = async (req, res) => {
    try {
        // Fetch the store details
        const store = await pool.query('SELECT * FROM store WHERE seller_id=$1', [req.user.id]);
        // Check if the logged in user has a store on the platform
        if (store.rows.length === 0) {
            return res.status(404).json({
                msg: 'You don\'t have a store on our database. Please create one from the menu to be able to use this service.',
                status: 'not found',
                status_code: '404'
            });
        }
        // Delete icon from cloudinary
        await cloudinary.v2.uploader.destroy(store.rows[0].icon.public_id, { folder: 'quickstore' });
        // Update store data
        await pool.query('UPDATE store SET icon=$1 WHERE seller_id=$2', [{}, req.user.id]);
        // Return success message
        return res.status(200).json({
            msg: 'Your store icon was deleted successfully',
            status: 'success',
            status_code: '200'
        });
    } catch (error) {
        // Return error if the server fails to fetch or update delete the user's store icon
        if (error) {
            return res.status(503).json({
                msg: 'Sorry we encountered an error while trying to delete your store icon. Please try again later, thank you.',
                status: 'service unavailable',
                status_code: '503'
            });
        }
    }
}

const getStoreIcon = async (req, res) => {
    try {
        // Fetch store details
        const store = await pool.query('SELECT * FROM store WHERE seller_id=$1', [req.user.id]);
        // Check if store exists
        if (store.rows.length ===  0) {
            return res.status(200).json({
                msg: 'You don\'t have a store on our database. Please create one from the menu to be able to use this service.',
                status: 'not found',
                status_code: '404'
            });
        }
        // Check if store icon exists or not
        if (!store.rows[0].icon || !store.rows[0].icon.public_id) {
            // Return error message if store icon does not exist
            return res.status(404).json({
                msg: 'You don\'t yet have a store icon. You can upload one from the menu.',
                status: 'not found',
                status_code: '404'
            });
        }
        // Return icon url
        return res.status(200).json({
            status: 'success',
            status_code: '200',
            data: store.rows[0].icon.secure_url
        });
    } catch (error) {
        // Return error if the server fails to fetch the icon
        if (error) {
            return res.status(503).json({
                msg: 'Sorry we encountered an error while fetching your store icon. Please try again later, thank you.',
                status: 'service unavailable',
                status_code: '503'
            });
        }
    }
}

const deleteStore = async (req, res) => {
    try {
        // First fetch the store
        const store = await pool.query('SELECT * FROM Store WHERE seller_id=$1', [req.user.id]);
        // Check if the store exists
        if (store.rows.length === 0) {
            // Return error response
            return res.status(404).json({
                msg: 'You don\'t have a store on our database.',
                status: 'not found',
                status_code: '404'
            });
        }
        // Check if the store has an icon
        if (store.rows[0].icon && store.rows[0].icon.public_id) {
            // Delete store icon from cloudinary
            await cloudinary.v2.uploader.destroy(store.rows[0].icon.public_id, { folder: 'quickstore' });
        }
        // Get all the products uploaded by this store owner
        const products = await pool.query('SELECT * FROM Product WHERE store_id=$1', [store.rows[0].store_id]);
        // Check if product exists
        if (products.rows.length > 0) {
            // Create a looping index
            let i;
            // loop through products
            for (i=0; i<products.rows.length; i++) {
                // Get each product photo public_id
                const product_images = products.rows[i].product_images;
                let j;
                for (j=0; j<product_images.length; j++) {
                    // Delete each product from cloudinary
                await cloudinary.v2.uploader.destroy(product_images[j].public_id, { folder: 'quickstore' });
                }
            }
        }
        // Delete all products
        await pool.query('DELETE FROM product WHERE store_id=$1', [store.rows[0].store_id]);
        // Delete store
        await pool.query('DELETE FROM store WHERE seller_id=$1', [req.user.id]);
        // Delete wallet
        await pool.query('DELETE FROM wallet WHERE user_id=$1', [req.user.id]);
        // Return success response
        return res.status(200).json({
            msg: 'Your store has been deleted successfully.',
            status: 'success',
            status_code: '200'
        });
    } catch (error) {
        // Return error if request fails
        if (error) {
            console.log(error);
            return res.status(503).json({
                msg: 'Sorry, we are unable to delete to this store at the moment. Please try again later, thank you.',
                status: 'service unavailable',
                status_code: '503'
            });
        }
    }
}

module.exports = {
    getAllStores,
    getSingleStoreById,
    getLoggedInUserStoreById,
    createOrUpdateStore,
    uploadStoreIcon,
    deleteStoreIcon,
    getStoreIcon,
    deleteStore
}