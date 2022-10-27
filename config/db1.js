const mongoose = require('mongoose');
require('dotenv').config();
const db = process.env.mongoURI;

module.exports = async function () {
    try {
        await mongoose.connect(db);
        console.log('MongoDB connected...');
    } catch (error) {
        console.log(error.message);
    }
}