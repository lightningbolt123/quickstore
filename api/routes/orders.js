const express = require('express');
const auth = require('../../middlewares/auth');
const { check, body } = require('express-validator');
const orderControllers = require('../../controllers/orderControllers');

// Create router
const router = express.Router();

// @Route   POST api/orders
// @Desc    Route for placing orders
// @Access  Private
router.post('/', [
    auth,
    [
        check('items','Items must contain an array of the items purchased.').isArray({ min: 1 }),
        check('total','Total must contain a numeric value.').isNumeric().isLength({ min:1 }),
        check('cardnumber','Card number must contain a valid card number with a minimum of 16 digits.').isNumeric().isLength({ min: 16 }),
        check('cvv','Card cvv must not be less than 3 digits.').isNumeric().isLength({ min:3 }),
        check('expirydate','Expiry must contain a valid date in the format(mm/yy), e.g. 07/25').isLength({ min:5 })
    ]
], orderControllers.placeOrder);

// @Route   PUT api/orders/id/item_id
// @Desc    Route for updating order status
// @Access  Private
router.put('/id/item_id', [
    auth,
    body('newstatus','The new status cannot be empty').not().isEmpty()
], orderControllers.updateOrderStatus);

// @Route   GET api/orders/vendororders
// @Desc    Route for getting all the orders on the logged in vendors store
// @Access  Private
router.get('/vendororders', auth, orderControllers.getOrders);

// @Route   GET api/orders/purchasehistory
// @Desc    Route for getting the purchase history of the logged in user
// @Access  Private
router.get('/purchasehistory', auth, orderControllers.getPurchaseHistory);

// @Route   GET api/orders/userisvendor
// @Desc    Route for checking if the logged in user is a vendor or not. It is going to be used to alter the logged in user's dashboard
//Access    Private
router.get('/userisvendor', auth, orderControllers.userIsVendor);

// Export the router
module.exports = router;