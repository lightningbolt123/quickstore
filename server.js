const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const ConnectMongoDB = require('./config/db1');
const ConnectPG = require('./config/db2');

const app = express();

ConnectMongoDB();

ConnectPG();

app.use(express.json({ limit: '10mb' }));
app.use(cors());
app.use('/api/users', require('./api/routes/users'));
app.use('/api/auth', require('./api/routes/auth'));
app.use('/api/store', require('./api/routes/store'));
app.use('/api/bank', require('./api/routes/bank'));
app.use('/api/orders', require('./api/routes/orders'));

const server = createServer(app);

const PORT = 5000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server started at port ${PORT}`));