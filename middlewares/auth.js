require('dotenv').config();
const secret = process.env.SECRET;
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if token exists
    if (!token) {
        return res.status(401).json({
            msg: 'No access token detected.',
            status: 'unauthorized',
            status_code: '401'
        });
    }
    try {

        // Verify the token
        const decoded = jwt.verify(token, secret);

        // Update the req object with the decoded data
        req.user = decoded.user;

        // Move unto the next protected route
        next();
    } catch (error) {

        // Return error if the token is not valid
        if (error) {
            return res.status(401).json({
                msg: 'You sent an invalid credential.',
                status: 'unauthorized',
                status_code: '401'
            })
        }
    }
}