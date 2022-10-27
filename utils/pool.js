const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.PG_DATABASE_USER,
    host: process.env.PG_DATABASE_HOST,
    database: process.env.PG_DATABASE_NAME,
    password: process.env.PG_DATABASE_PASSWORD,
    port: process.env.PG_DATABASE_PORT
});

module.exports = pool;