const pool = require('../utils/pool');

module.exports = async function () {
    try {
        await pool.query('SELECT NOW()');
        console.log('AWS database connected...');
    } catch (error) {
        console.log(error.message);
    }
}