const express = require('express');
const { body, check } = require('express-validator');
const auth = require('../../middlewares/auth');
const storeControllers = require('../../controllers/storeControllers');
const productControllers = require('../../controllers/productControllers');
const cartControllers = require('../../controllers/cartControllers');
const wishlistControllers = require('../../controllers/wishlistControllers');
const reviewControllers = require('../../controllers/reviewControllers');

const router = express.Router();

// @Route   GET api/store/all
// @Desc    Route for getting all stores
// @Access  Public
router.get('/all', storeControllers.getAllStores);

// @Route   GET api/store/all/:id
// @Desc    Route for getting single store details
// @Access  Public
router.get('/all/:id', storeControllers.getSingleStoreById);

// @Route   GET api/store/mystore
// @Desc    Route for getting the store details of the logged in user
// @Access  Private
router.get('/mystore', auth, storeControllers.getLoggedInUserStoreById);

// @Route   POST api/store
// @Desc    Route for creating and updating a store
// @Access  Private
router.post('/', [
    auth,
    [
        check('name','Store name cannot be empty').not().isEmpty(),
        check('house','House cannot be empty').not().isEmpty(),
        check('street','Street cannot be empty').not().isEmpty(),
        check('postalcode','Postal code cannot be empty').isNumeric().isLength({ min:2 }),
        check('city','City code cannot be empty').not().isEmpty(),
        check('country','Country cannot be empty').not().isEmpty()
    ]
], storeControllers.createOrUpdateStore);

// @Route   POST api/store/icon
// @Desc    Route for uploading and updating store icons
// @Access  Private
router.post('/icon', [
    auth,
    body('icon','You have to select an icon for your store from your computer.').not().isEmpty()
], storeControllers.uploadStoreIcon);

// @Route   DELETE api/store/icon
// @Desc    This route is used for deleting the logged in user's store icon
// @Access  Private
router.delete('/icon', auth, storeControllers.deleteStoreIcon);

// @Route   GET api/store/icon
// @Desc    This route is used for fetching a store icon
// @Access  Private
router.get('/icon', auth, storeControllers.getStoreIcon);

// @Route   POST api/store/products/all
// @Desc    This is the route for uploading a product on the platform
// @Access  Private
router.post('/products/all', [
    auth,
    [
        check('name','The product name cannot be empty.').not().isEmpty(),
        check('description','The product description cannot be more than 500 characters long.').isLength({ max: 500 }),
        check('category','The product category cannot be empty.').not().isEmpty(),
        check('price', 'The product price can only take in numbers.').isNumeric().isLength({ min:1 }),
        check('discount','The discount field can only take in numbers and decimals.').isNumeric().isLength({ min:1 }),
        check('images','Images cannot be empty.').isArray({ min: 1 }),
        check('quantity','Quantity cannot be empty').isNumeric().isLength({ min:1 })
    ]
], productControllers.createProduct);

// @Route   PUT api/store/products/all/:id
// @Desc    This route is used for editing a product
// @Access  Private
router.put('/products/all/:id', [
    auth,
    [
        check('name','The product name cannot be empty.').not().isEmpty(),
        check('description','The product description cannot be empty.').not().isEmpty(),
        check('category','The product category cannot be empty.').not().isEmpty(),
        check('price', 'The product price can only take in numbers.').isNumeric().isLength({ min:1 }),
        check('discount','The discount field can only take in numbers and decimals.').isNumeric().isLength({ min:1 })
    ]
], productControllers.updateProduct);

// @Route   GET api/store/products/all
// @Desc    This is the route for getting all products on the platform
// @Access  Public
router.get('/products/all', productControllers.getAllProducts);

// @Route   GET api/store/products/all/:id
// @Desc    This is the route for getting single product details
// @Access  Public
router.get('/products/all/:id', productControllers.getProductById);

// @Route   GET api/store/products/category/:category_name
// @Desc    This route is used for fetching products by their category
// @Access  Public
router.get('/products/category/:category_name', productControllers.getProductByCategory);

// @Route   GET api/store/products/vendors/:vendor_id
// @Desc    This is the route for getting all products uploaded by a certain vendor
// @Access  Public
router.get('/products/vendors/:vendor_id', productControllers.getProductBySellerId);

// @Route   POST api/store/products/photo/:product_id
// @Desc    This route is used for updating product images
// @Access  Private
router.post('/products/photo/:product_id', [
    auth,
    body('photos','Photos must contain an array of photos.').isArray({ min:1 })
], productControllers.addImagesToProduct);

// @Route   DELETE api/store/products/:product_id/photo?public_id="xyz"
// @Desc    This route is used for deleting photos from a product
// @Access  Private
router.delete('/products/:product_id/photo', auth, productControllers.deleteProductPhoto);

// @Route   DELETE api/store/products/all/:id
// @Desc    This is the route for deleting an entire product data from the platform
// @Access  Private
router.delete('/products/all/:id', auth, productControllers.deleteProduct);

// @Route   DELETE api/store/mystore
// @Desc    This is the route for deleting a user's store and all of it's related information
// @Access  Private
router.delete('/mystore', auth, storeControllers.deleteStore);

// @Route   POST api/store/cart
// @Desc    Route for adding products to cart
// @Access  Private
router.post('/cart', [
    auth,
    [
        check('productname','Product name cannot be empty.').not().isEmpty(),
        check('productimage','Product image cannot be empty.').not().isEmpty(),
        check('productprice','Product price cannot be empty.').not().isEmpty(),
        check('productquantity','Product quantity cannot be empty.').not().isEmpty(),
        check('productid','Product id cannot be empty.').not().isEmpty()
    ]
], cartControllers.addItemToCart);

// @Route   GET api/store/cart
// @Desc    Route for getting all items in the logged in user's cart
// @Access  Private
router.get('/cart', auth, cartControllers.getCart);

// @Route   DELETE api/store/cart
// @Desc    Route for removing product from cart
// @Access  Private
router.delete('/cart/:id', auth, cartControllers.removeItemFromCart);


// @Route   POST api/store/mywishlist
// @Desc    Route for adding product to wishlist
// @Access  Private
router.post('/mywishlist', [
    auth,
    [
        check('productname','Product name cannot be empty.').not().isEmpty(),
        check('productimage','Product image cannot be empty.').not().isEmpty(),
        check('productid','Product id cannot be empty.').not().isEmpty(),
        check('productprice','Product price cannot be empty.').not().isEmpty(),
    ]
], wishlistControllers.addItemToWishlist);

// @Route   GET api/store/mywishlist
// @Desc    Route for fetching all of the items on a user's wishlist
// @Access  Private
router.get('/mywishlist', auth, wishlistControllers.getWishlist);

// @Route   DELETE api/store/mywishlist/:id
// @Desc    Route for removing items from wishlist
// @Access  Private
router.delete('/mywishlist/:id', auth, wishlistControllers.removeItemFromWishlist);

// @Route   POST api/store/review
// @Desc    Route for submiting a logged in user's review
// @Access  Private
router.post('/review', [
    auth,
    [
        check('message','Message cannot be empty.').not().isEmpty(),
        check('rating','Rating cannot be empty.').not().isEmpty(),
        check('productid','Product id cannot be empty.').not().isEmpty()
    ]
], reviewControllers.addProductReview);

// @Route   GET api/store/review/:product_id
// @Desc    Route for getting a product review
// @Access  Private
router.get('/review/:product_id', reviewControllers.getProductReviews);

module.exports = router;