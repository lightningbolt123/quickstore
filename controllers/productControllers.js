const pool = require('../utils/pool');
const { validationResult } = require('express-validator');
const { cloudinary } = require('../utils/cloudinary');

const createProduct = async (req, res) => {
    // Check for errors in body request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // Destructure the parameters for the store creation from the body request
    const { name, description, category, price, discount, features, specifications, images } = req.body;
    try {
        // Fetch the user's store
        const store = await pool.query('SELECT * FROM store WHERE seller_id=$1',[req.user.id]);
        // Check if store exists
        if (store.rows.length ===  0) {
            return res.status(200).json({
                msg: 'You don\'t have a store on our database. Please first create one from the menu before uploading a product.',
                status: 'not found',
                status_code: '404'
            });
        }
        // Create a new image object
        const newImages = [];
        // Create an idex of each image
        let i;
        // Loop through the uploaded images object
        for (i=0; i<images.length; i++) {
            // Upload each image
            const imageUpload = await cloudinary.v2.uploader.upload(images[i], { folder: 'quickstore', resource_type: 'auto' });
            // Create a new object containing the public_id and secure_url of the uploaded image
            const newImage = {
                public_id: imageUpload.public_id,
                secure_url: imageUpload.secure_url
            };
            // Update the new images array
            newImages.push(newImage);
        }
        // Create product specifications object
        let product_specifications;
        // Create product features array
        let product_features;
        // Check if the product specifications object was included in the request body and update the product_specifications variable
        if (specifications) {
            product_specifications = specifications;
        } else {
            product_specifications = {};
        }
        // Check if the product features array was included in the request body and update the product_features object
        if (features) {
            product_features = features.map(feature => feature.trim());
        } else {
            product_features = [];
        }
        // Upload product
        await pool.query('INSERT INTO product (store_id, product_name, product_description, product_category, product_price, product_discount, product_images, product_features, product_specifications) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [
            store.rows[0].store_id,
            name,
            description,
            category,
            parseFloat(price).toFixed(2),
            parseFloat(discount).toFixed(2),
            newImages,
            product_features,
            product_specifications
        ]);
        // Return success message
        return res.status(201).json({
            msg: 'You have successfully uploaded a product to your store.',
            status: 'created',
            status_code: '201'
        });
    } catch (error) {
        // Return error message if the remote services are unavailable
        if (error) {
            console.log(error.message);
            return res.status(503).json({
                msg: 'We are unable to upload your product image at the moment. Please try again later, thank you.',
                status: 'service unavailable',
                status_code: '503'
            });
        }
    }
}

const updateProduct = async (req, res) => {
   // Check for errors in body request
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
   }
   // Destructure the parameters for the store creation from the body request
   const { name, description, category, price, discount, features, specifications } = req.body;
   try {
       // Fetch the user's store
       const store = await pool.query('SELECT * FROM store WHERE seller_id=$1', [req.user.id]);
       // Check if the store exists and return error message if it doesn't exist
       if (store.rows.length === 0) {
           return res.status(404).json({
               msg: 'You don\'t have a store on our database. Please first create one from the menu before uploading a product.',
               status: 'not found',
               status_code: '404'
           });
       }
       // Fetch product
       const product = await pool.query('SELECT * FROM product WHERE id=$1', [req.params.id]);
       // Check if product exists
       if (product.rows.length === 0) {
           return res.status(404).json({
               msg: 'You are trying to update a product that does not exist on our database.',
               status: 'not found',
               status_code: '404'
           });
       }
       // Check if the seller of the product is the same as the logged in user
       if (product.rows[0].store_id !== store.rows[0].store_id) {
           return res.status(401).json({
               msg: 'You cannot edit this product details because you are not the store owner.',
               status: 'unauthorized',
               status_code: '401'
           });
       }
       // Create product specifications object
       let product_specifications;
       // Create product features array
       let product_features;
       // Check if the product specifications object was included in the request body and update the product_specifications variable
       if (specifications) {
           product_specifications = specifications;
       } else {
           product_specifications = product.rows[0].product_specifications;
       }
       // Check if the product features array was included in the request body and update the product_features object
       if (features) {
           product_features = features.split(',').map(feature => feature.trim());
       } else {
           product_features = product.rows[0].product_features;
       }
       // Update product details
       await pool.query('UPDATE product SET product_name=$1, product_description=$2, product_category=$3, product_price=$4, product_discount=$5, product_features=$6, product_specifications=$7 WHERE id=$8', [
           name, description, category, price, discount, product_features, product_specifications, req.params.id
       ]);

       // Return success message
       return res.status(201).json({
           msg: 'Your product data was updated successfully.',
           status: 'created',
           status_code: '201'
       });
   } catch (error) {
       // Return error message if the remote services are unavailable
       if (error) {
           return res.status(503).json({
               msg: 'We are unable to update your product details at the moment. Please try again later, thank you.',
               status: 'service unavailable',
               status_code: '503'
           });
       }
   }
};

const getAllProducts = async (req, res) => {
    try {
        // Fetch all products
        const products = await pool.query('SELECT * FROM product ORDER BY id ASC');
        // Check if products exists on the platform
        if (products.rows.length === 0) {
            // Return empty array
            return res.status(200).json({
                status: 'success',
                status_code: '200',
                data: []
            });
        } else {
            // Return product
            return res.status(200).json({
                status: 'success',
                status_code: '200',
                data: products.rows
            });
        }
    } catch (error) {
        // Return error if request fails
        if (error) {
            return res.status(503).json({
                msg: 'Sorry, we are unable to retrieve all products at the moment. Please try again later, thank you.',
                status: 'service unavailable',
                status_code: '503'
            });
        }
    }
}

const getProductById = async (req, res) => {
    try {
        // Fetch product details
        const product = await pool.query('SELECT * FROM product WHERE id=$1', [req.params.id]);
        const data = product.rows[0];
        const discount = (product.rows[0].product_discount / 100) * product.rows[0].product_price;
        if (data.product_discount !== null || data.product_discount > 0) {
            const new_price = product.rows[0].product_price - discount;
            data.new_price = new_price;
        }
        // Check if product exists on the database
        if (product.rows.length === 0) {
            return res.status(404).json({
                msg: 'The product you just searched for does not exist.',
                status: 'not found',
                status_code: '404'
            });
        } else {
            // Return product
            return res.status(200).json({
                status: 'success',
                status_code: '200',
                data
            });
        }
    } catch (error) {
        // Return error if request fails
        if (error) {
            return res.status(503).json({
                msg: 'Sorry, we are unable to retrieve this product details at the moment. Please try again later, thank you.',
                status: 'service unavailable',
                status_code: '503'
            });
        }
    }
}

const getProductByCategory = async (req, res) => {
    try {
        // Fetch all the products that belongs to that category
        const products = await pool.query('SELECT * FROM product WHERE product_category=$1', [req.params.category_name]);
        // Return the products
        return res.status(200).json({
            status: 'success',
            status_code: '200',
            data: products.rows
        });
    } catch (error) {
        // Return error if request fails
        if (error) {
            console.log(error);
            // Return error if the server fails to retrieve the products under that category
            return res.status(503).json({
                msg: 'Sorry, we are unable to retrieve all the products under this category at the moment. Please try again later, thank you.',
                status: 'service unavailable',
                status_code: '503'
            });
        }
    }
}

const getProductBySellerId = async (req, res) => {
    try {
        // Fetch vendor store details
        const products = await pool.query('SELECT * FROM product WHERE store_id=$1', [req.params.vendor_id]);
        // Return the products
        return res.status(200).json({
            status: 'success',
            status_code: '200',
            data: products.rows
        });
    } catch (error) {
        // Return error if request fails
        if (error) {
            // Return error if request fails
            return res.status(503).json({
                msg: 'Sorry, we are unable to retrieve all the products sold by this vendor at the moment. Please try again later, thank you.',
                status: 'service unavailable',
                status_code: '503'
            });
        }
    }
}

const addImagesToProduct = async (req, res) => {
    // Validate body request
    const error = validationResult(req);
    
    try {
        // Check for errors in body request and return an error if one exists
        if (!error.isEmpty()) {
            return res.status(400).json(error.errors[0]);
        }
        // Destructure photos array from body request
        const { photos } = req.body;
        // Fetch product
        const product = await pool.query('SELECT * FROM product WHERE id=$1', [req.params.product_id]);
        // Check if product exists on the database
        if (product.rows.length === 0) {
            return res.status(404).json({
                msg: 'The product you are trying to update does not exist.',
                status: 'not found',
                status_code: '404'
            })
        }
        // Check if store already exists
        const store = await pool.query('SELECT * FROM store WHERE store_id=$1', [product.rows[0].store_id]);
        if (store.rows.length === 0) {
            // return error message if the store does not exist
            return res.status(404).json({
                msg: 'This product does not belong to any store on our database. Therefore, it cannot be updated.',
                status: 'not found',
                status_code: '404'
            });
        }
        if (store.rows[0].seller_id !== req.user.id) {
            // Return error message in the case where the logged in user is not the same as the store owner
            return res.status(401).json({
                msg: 'You are not allowed to update this product images because you are not the store owner.',
                status: 'unauthorized',
                status_code: '401'
            });
        }
        // Create an object containing that will hold the updated store images
        const updatedImages = [...product.rows[0].product_images]
        let i;
        // Loop through the photos array and upload each photo
        for (i=0; i<photos.length; i++) {
            // upload each photo
            const uploadPhoto = await cloudinary.v2.uploader.upload(photos[i], { folder: 'quickstore', resource_type: 'auto' });
            // Create an upload object from each photo
            const photoObject = {
                public_id: uploadPhoto.public_id,
                secure_url: uploadPhoto.secure_url
            }
            // Add the uploaded photo to the updated images array
            updatedImages.push(photoObject);
        }
        // Update the product details
        await pool.query('UPDATE product SET product_images=$1 WHERE id=$2', [updatedImages, req.params.product_id]);
        // Check if the photos array length is greater than one
        if (photos.length > 1) {
            // Return success message for multiple image upload
            return res.status(201).json({
                msg: 'You have successfully added images to this product.',
                status: 'created',
                status_code: '201'
            });
        } else {
            // Return success message for single image upload
            return res.status(201).json({
                msg: 'You have successfully added an image to this product.',
                status: 'created',
                status_code: '201'
            });
        }
    } catch (error) {
        // Return error if request fails
        if (error) {
            return res.status(503).json({
                msg: 'Sorry, we are unable to add images to this product at the moment. Please try again later, thank you.',
                status: 'service unavailable',
                status_code: '503'
            });
        }
    }
}

const deleteProductPhoto = async (req, res) => {
    // Destructure parameters from url endpoint
    const { product_id } = req.params;
    const { public_id } = req.query;
    try {
        // First get the product from the database
        const product = await pool.query('SELECT * FROM Product WHERE id=$1', [product_id]);
        // Check if the product exists
        if (product.rows.length === 0) {
            return res.status(404).json({
                // Return error message
                msg: 'The product you are trying to update does not exist.',
                status: 'not found',
                status_code: '404'
            });
        }
        // Fetch the store selling that product
        const productStore = await pool.query('SELECT * FROM Store WHERE store_id=$1', [product.rows[0].store_id]);
        // Check if the product's store owner is the same as the logged in user
        if (productStore.rows[0].seller_id !== req.user.id) {
            // Return error message in the case where the logged in user is not the same as the store owner
            return res.status(401).json({
                msg: 'You are not allowed to delete this product image because you are not the store owner.',
                status: 'unauthorized',
                status_code: '401'
            });
        }
        // Check if the product image exists
        const imageExists = product.rows[0].product_images.filter(item => item.public_id === public_id);
        if (imageExists.length === 0) {
            return res.status(404).json({
                msg: 'The image you are trying to delete does not exist on our database.',
                status: 'not found',
                status_code: '404'
            });
        }
        // Delete image from cloudinary cloud storage
        await cloudinary.v2.uploader.destroy(public_id, { folder: 'quickstore' });
        // Create new array containing the updated images
        const updatedImages = product.rows[0].product_images.filter(item => item.public_id !== public_id);
        // Update product details
        await pool.query('UPDATE Product SET product_images=$1 WHERE id=$2', [updatedImages, product_id]);
        // Return success message
        return res.status(200).json({
            msg: 'The product image was deleted successfully',
            status: 'success',
            status_code: '200'
        });
    } catch (error) {
        // Return error if request fails
        if (error) {
            console.log(error);
            return res.status(503).json({
                msg: 'Sorry, we are unable to delete this product image at the moment. Please try again later, thank you.',
                status: 'service unavailable',
                status_code: '503'
            });
        }
    }
}

const deleteProduct = async (req, res) => {
    try {
        // Destructure the product id from the request parameter
        const { id } = req.params;
        // Fetch the product with that id
        const product = await pool.query('SELECT * FROM Product WHERE id=$1', [id]);
        // Check if the product exists
        if (product.rows.length === 0) {
            return res.status(404).json({
                msg: 'The product you are trying to delete does not exist.',
                status: 'not found',
                status_code: '404'
            });
        }
        // Fetch the store selling that product
        const productStore = await pool.query('SELECT * FROM Store WHERE store_id=$1', [product.rows[0].store_id]);
        // Check if the product's store owner is the same as the logged in user
        if (productStore.rows[0].seller_id !== req.user.id) {
            // Return error message in the case where the logged in user is not the same as the store owner
            return res.status(401).json({
                msg: 'You are not allowed to delete this product because you are not the store owner.',
                status: 'unauthorized',
                status_code: '401'
            });
        }
        const images = product.rows[0].product_images;
        // Check if the product has images
        if (images.length > 0) {
            let i;
            for (i=0; i<images.length; i++) {
                // Delete the images from cloudinary
                await cloudinary.v2.uploader.destroy(images[i].public_id, { folder: 'quickstore' });
            }
        }
        // Delete the product from the database
        await pool.query('DELETE FROM Product WHERE id=$1', [id]);
        // Return success message
        return res.status(200).json({
            msg: 'Your product was deleted successfully.',
            status: 'success',
            status_code: '200'
        });
    } catch (error) {
        // Return error if request fails
        if (error) {
            return res.status(503).json({
                msg: 'Sorry, we are unable to delete to this product at the moment. Please try again later, thank you.',
                status: 'service unavailable',
                status_code: '503'
            });
        }
    }
}

module.exports = {
    createProduct,
    updateProduct,
    getAllProducts,
    getProductById,
    getProductByCategory,
    getProductBySellerId,
    addImagesToProduct,
    deleteProductPhoto,
    deleteProduct
};