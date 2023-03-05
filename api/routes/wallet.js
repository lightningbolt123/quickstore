const express = require('express');
const { check } = require('express-validator');
const auth = require('../../middlewares/auth');
const walletControllers = require('../../controllers/walletControllers');
const router = express.Router();

// @Route   GET api/wallet
// @Desc    Route for getting logged in user's wallet balance
// @Access  Private
router.get('/', auth, walletControllers.getWalletBalance);

// @Route   POST api/wallet
// @Desc    Route for transferring funds from user wallet to account
// @Access  Private
router.post('/', [
    auth,
    [
        check('amount','Amount cannot be less than one numerical value').isNumeric().isLength({ min: 1 }),
        check('accountname','Your account name cannot be empty.').not().isEmpty(),
        check('accountiban','Your IBAN cannot be empty.').not().isEmpty()
    ]
], walletControllers.transferFund);

module.exports = router;