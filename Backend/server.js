const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');  // Import connectDB
const { PORT } = require('./config/env');  // Import PORT từ env.js

const app = express();
app.use(express.json());
app.use(cors());

// Kết nối Database
connectDB();

app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
});
