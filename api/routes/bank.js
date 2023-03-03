const express = require('express');
const { check } = require('express-validator');
const auth = require('../../middlewares/auth');
const bankControllers = require('../../controllers/bankControllers');

// Create router from the express microframework
const router = express.Router();

// @Route   POST api/bank/
// @Desc    Route for adding bank account to the logged in user's dashboard
// @Access  Private
router.post('/', [
    auth,
    [
        check('bankname','Bank name cannot be empty.').not().isEmpty(),
        check('accountname','Account name cannot be empty.').not().isEmpty(),
        check('accountiban','Account IBAN cannot be empty.').not().isEmpty(),
        check('cardnumber', 'Account number cannot be empty.').isNumeric().isLength({ min: 8 })
    ]
], bankControllers.addBankAccount);

// @Route   PUT api/bank/:id
// @Desc    Route for editing bank account details
// @Access  Private
router.put('/:id', [
    auth,
    [
        check('bankname','Bank name cannot be empty.').not().isEmpty(),
        check('accountname','Account name cannot be empty.').not().isEmpty(),
        check('accountiban','Account IBAN cannot be empty.').not().isEmpty(),
        check('cardnumber', 'Account number cannot be empty.').isNumeric().isLength({ min: 8 })
    ]
], bankControllers.editBankAccount);

// @Route   GET api/bank/
// @Desc    Route for getting all the bank accounts of the logged in user
// @Access  Private
router.get('/', auth, bankControllers.getBankAccounts);

// @Route   GET api/bank/:id
// @Desc    Route for getting single bank details
// @Access  Private
router.get('/:id', auth, bankControllers.getBankAccount);

// @Route   DELETE api/bank/myaccounts/:id
// @Desc    Route for deleting a bank account of the logged in user
// @Access  Private
router.delete('/:id', auth, bankControllers.deleteBankAccount);

// Export the router
module.exports = router;