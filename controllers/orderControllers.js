const { validationResult } = require('express-validator');
const pool = require('../utils/pool');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const cards = [
    {
        cardnumber: "4242424242424242",
        cardtype: "visa",
        cvv: "721",
        expirydate: "02/25",
        balance: "10000",
        currency: "USD"
    },
    {
        cardnumber: "4000056655665556",
        cardtype: "visa_debit",
        cvv: "637",
        expirydate: "06/23",
        balance: "15000",
        currency: "USD"
    },
    {
        cardnumber: "5555555555554444",
        cardtype: "mastercard",
        cvv: "468",
        expirydate: "07/24",
        balance: "20000",
        currency: "USD"
    },
    {
        cardnumber: "5200828282828210",
        cardtype: "mastercard_debit",
        cvv: "551",
        expirydate: "10/26",
        balance: "25000",
        currency: "USD"
    }
];

// The controller for placing orders
const placeOrder = async (req, res) => {
    const errors = validationResult(req);
    // Check for errors in the body request
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // Destructure the transaction details from the body request
    const {
        items,
        total,
        cardnumber,
        cvv,
        expirydate
    } = req.body;
    try {
        // Get user account
        const user = await User.findById(req.user.id);
        // Check if user account exists
        if (!user) {
            return res.status(401).json({
                msg: 'You are not authorized to make use of this feature.',
                status: 'unauthorized',
                status_code: '401'
            });
        }
        // Get firstname, lastname, and email from user object
        const { firstname, lastname } = user;
        // Create customer phone number
        const phone = user.phonenumber;
        // Create reference number
        const reference = uuidv4();
        // Process card payment
        const cardIsValid = cards.filter(card => card.cardnumber === cardnumber);
        const cvvIsValid = cardIsValid.filter(card => card.cvv === cvv);
        const cardExpiryDateIsValid = cvvIsValid.filter(card => card.expirydate === expirydate);
        // Check if card number is valid
        if (cardIsValid.length === 0) {
            return res.status(400).json({
                msg: 'The card number you typed in is invalid.',
                status: 'bad request',
                status_code: '400'
            });
        }
        // Check if card cvv is valid
        if (cvvIsValid.length === 0) {
            return res.status(400).json({
                msg: 'The card cvv you typed in is invalid. Please type in the correct cvv.',
                status: 'bad request',
                status_code: '400'
            });
        }
        // Check if card expirydate is valid
        if (cardExpiryDateIsValid.length === 0) {
            return res.status(400).json({
                msg: 'The card cvv you typed in is invalid. Please type in the correct expiry date.',
                status: 'bad request',
                status_code: '400'
            });
        }
        // Get the card details
        const card = cards.find(card => card.cardnumber === cardnumber);
        // Check if the card balance is sufficient for the transaction, i.e. The card balance is more than the price of the transaction
        if (parseFloat(card.balance) < parseFloat(total)) {
            return res.status(400).json({
                msg: 'Your transaction failed due to insuffiecient card funds.',
                status: 'bad request',
                status_code: '400'
            });
        }
        // Create new card balance
        const balance = parseFloat(card.balance) - parseFloat(total);
        cards.map(card => card.cardnumber === cardnumber ? card.balance = balance.toString() : card);

        // Loop through the items
        let i;
        for (i=0; i<items.length; i++) {
            // Fetch vendor wallet balance
            const wallet = await pool.query('SELECT * FROM wallet WHERE store_id=$1',[items[i].storeid]);
            const ledger_balance = wallet.rows[0].ledger_balance + parseFloat(items[i].cost)
            // Update the vendors wallet balance for each item purchased
            await pool.query('UPDATE wallet SET ledger_balance=$1 WHERE store_id=$2', [ledger_balance, parseInt(items[i].storeid)]);
        }
        
        // Create new order
        const order = new Order({
            customerid: req.user.id,
            customerfirstname: firstname,
            customerlastname: lastname,
            customerphone: phone,
            goodspurchased: items
        });

        // Empty the user's cart once the request is successfully
        const response = await order.save();
        if (response) {
            await Cart.findOneAndUpdate({ user: req.user.id }, { $set: { items: [] } }, { new: true });
        }

        // Return success response
        return res.status(200).json({
            msg: 'Your purchase was successful and your order is being processed at the moment. You have to confirm that you have received your good while it is been handed over to you to complete your transaction. Thank you for using quickstore.',
            status: 'success',
            status_code: '200',
            data: order
        });
    } catch (error) {
        // Check for server error
        if (error) {
            return res.status(503).json({
                msg: 'We encountered an error while processing your transaction. Please try again later, thank you.',
                status: 'service unavailable',
                status_code: '503'
            });
        }
    }
}

// The controller for updating order status
const updateOrderStatus = async (req, res) => {
    const error = validationResult(req);
    // Check for errors in the body request
    if (!error.isEmpty()) {
        return res.status(400).json(error.errors[0]);
    }
    const { newstatus } = req.body;
    const { id, item_id } = req.params;
    try {
        // Get user account
        const user = await User.findById(req.user.id);
        // Check if user account exists
        if (!user) {
            return res.status(401).json({
                msg: 'You are not authorized to make use of this feature.',
                status: 'unauthorized',
                status_code: '401'
            });
        }

        // Get the order data
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({
                msg: 'The order you are trying to update does not exist.',
                status: 'not found',
                status_code: '404'
            });
        }
        if (newstatus !== 'received' || newstatus !== 'cancelled' || newstatus !== 'processing') {
            return res.status(400).json({
                msg: 'Wrong purchase status detected.',
                status: 'bad request',
                status_code: '400'
            })
        }
        // Get order object
        const orderObject = order.goodspurchased.find(item => item._id.toString() === item_id);
        // Update order status
        order.goodspurchased.map(item => item._id.toString() === item_id ? item.status = newstatus : item);
        // Save order
        await order.save();
        // Get the vendor wallet
        const wallet = await pool.query('SELECT * FROM wallet WHERE store_id=$1',[orderObject.storeid]);
        // Check status
        if (newstatus === 'received' && orderObject.status === 'processing') {
            // Create new available balance and ledger balance
            const availableBalance = wallet.rows[0].available_balance + parseFloat(orderObject.cost);
            const ledgerBalance = wallet.rows[0].ledger_balance - parseFloat(orderObject.cost);
            // Update the vendor wallet balance
            await pool.query('UPDATE wallet SET available_balance=$1, ledger_balance=$2 WHERE store_id=$3', [availableBalance, ledgerBalance, orderObject.storeid]);
            return res.status(200).json({
                msg: 'You have successfully confirmed the receival of this product.',
                status: 'success',
                status_code: '200',
                order_status: 'received',
                item_id
            });
        } else if (newstatus === 'cancelled' && orderObject.status === 'processing') {
            let goods;
            if (order.goodspurchased.length > 1) {
                goods = 'items';
            } else {
                goods = 'item';
            }
            // Create new ledger balance
            const ledgerBalance = wallet.rows[0].ledger_balance - parseFloat(orderObject.cost);
            // Update the vendor wallet balance
            await pool.query('UPDATE wallet SET ledger_balance=$1 WHERE store_id=$2', [ledgerBalance, orderObject.storeid]);
            // Send notification sms to the customer that their purchase has been cancelled and their funds have refunded to their account
            await client.messages.create({
                body: `Hi ${order.customerfirstname} ${order.customerlastname}, your order for the purchase of ${order.goodspurchased.length} ${goods} has been cancelled and your funds are been processed. Thank you once more for using quickstore.`,
                from: '+12075033646',
                to: `${order.customerphone}`
            });
            // Return success response
            return res.status(200).json({
                msg: 'Your have successfully cancelled this order and your funds are been processed.',
                status: 'success',
                status_code: '200',
                order_status: 'cancelled',
                item_id
            });
        } else if (orderObject.status !== 'processing') {
            return res.status(200).json({
                msg: 'You have already confirmed this order.',
                status: 'success',
                status_code: '200',
                order_status: orderObject.status,
                item_id
            });
        }
    } catch (error) {
        // Check for server error
        if (error) {
            return res.status(503).json({
                msg: 'We encountered an error while confirming your order. Please try again later, thank you.',
                status: 'service unavailable',
                status_code: '503'
            });
        }
    }
}

// Controller for getting a single order
const getInvoice = async (req, res) => {
    try {
        // Get user account
        const user = await User.findById(req.user.id);
        // Check if user account exists
        if (!user) {
            return res.status(401).json({
                msg: 'You are not authorized to make use of this feature.',
                status: 'unauthorized',
                status_code: '401'
            });
        }
        // Fetch the invoice for the account
        const invoice = await Order.findById(req.params.id);
        if (!invoice) {
            return res.status(404).json({
                msg: 'Invoice not found.',
                status: 'not found',
                status_code: '404'
            });
        }
        // Check if the customer id is the same as the logged in user id
        if (invoice.customerid.toString() !== req.user.id) {
            return res.status(401).json({
                msg: 'You are not authorized to view this invoice.',
                status: 'unauthorized',
                status_code: '401'
            });
        }
        // Return response
        return res.status(200).json({
            status: 'success',
            status_code: '200',
            data: invoice
        });
    } catch (error) {
        // Return error if error exists
        if (error) {
            return res.status(503).json({
                msg: 'Sorry we are unable to get your orders at the moment. Please try again later, thank you.',
                status: 'service unavailable',
                status_code: '503'
            });
        }
    }
}

// Controller for getting vendor orders
const getOrders = async (req, res) => {
    try {
        // Get user account
        const user = await User.findById(req.user.id);
        // Check if user account exists
        if (!user) {
            return res.status(401).json({
                msg: 'You are not authorized to make use of this feature.',
                status: 'unauthorized',
                status_code: '401'
            });
        }
        // Get vendor store
        const store = await pool.query('SELECT * FROM store WHERE seller_id=$1',[req.user.id]);
        // Get all the orders belonging to the logged in vendor
        const orders = await Order.find({ items: { $elemMatch: { storeid: store.rows[0].store_id } } });
        // Check if the orders array is empty or not
        if (!orders) {
            return res.status(200).json({
                status: 'success',
                status_code: '200',
                data: []
            });
        } else {
            return res.status(200).json({
                status: 'success',
                status_code: '200',
                data: orders
            });
        }
    } catch (error) {
        if (error) {
            return res.status(503).json({
                msg: 'Sorry we are unable to get your orders at the moment. Please try again later, thank you.',
                status: 'service unavailable',
                status_code: '503'
            });
        }
    }
}

// Controller for getting customer order history on the platform
const getPurchaseHistory = async (req, res) => {
    try {
        // Get user account
        const user = await User.findById(req.user.id);
        // Check if user account exists
        if (!user) {
            return res.status(401).json({
                msg: 'You are not authorized to make use of this feature.',
                status: 'unauthorized',
                status_code: '401'
            });
        }
        // Get all the orders belonging to the logged in vendor
        const orders = await Order.find({ customerid: req.user.id });
        // Check if the orders array is empty or not
        if (!orders) {
            return res.status(200).json({
                status: 'success',
                status_code: '200',
                data: []
            });
        } else {
            return res.status(200).json({
                status: 'success',
                status_code: '200',
                data: orders
            });
        }
    } catch (error) {
        if (error) {
            return res.status(503).json({
                msg: 'Sorry we are unable to get your order history at the moment. Please try again later, thank you.',
                status: 'service unavailable',
                status_code: '503'
            });
        }
    }
}

// Controller for checking if the user is a vendor or a customer
const userIsVendor = async (req, res) => {
    try {
        // Get user account
        const user = await User.findById(req.user.id);
        // Check if user account exists
        if (!user) {
            return res.status(401).json({
                msg: 'You are not authorized to make use of this feature.',
                status: 'unauthorized',
                status_code: '401'
            });
        }
        // Fetch the store of the logged in user
        const store = await pool.query('SELECT * FROM store WHERE seller_id=$1',[req.user.id]);
        //Check if the store exists
        if (store.rows.length > 0) {
            return res.status(200).json({
                status: 'success',
                status_code: '200',
                data: true
            });
        } else {
            return res.status(200).json({
                status: 'success',
                status_code: '200',
                data: false
            });
        }
    } catch (error) {
        if (error) {
            return res.status(503).json({
                msg: 'Sorry we are unable to complete your request at the moment. Please try again later. Thank you.',
                status: 'service unavailable',
                status_code: '503'
            });
        }
    }
}

module.exports = {
    placeOrder,
    updateOrderStatus,
    getOrders,
    getPurchaseHistory,
    userIsVendor,
    getInvoice
};
