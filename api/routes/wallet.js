const express = require('express');
const { check } = require('express-validator');
const auth = require('../../middlewares/auth');
const walletControllers = require('../../controllers/walletControllers');
const router = express.Router();

// @Route   GET api/wallet
// @Desc    Route for getting logged in user's wallet balance
// @Access  Private
router.get('/', auth, walletControllers.getWalletBalance);

module.exports = router;