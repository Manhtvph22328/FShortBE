const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');  // Import connectDB
const { PORT } = require('./config/env');  // Import PORT từ env.js

const app = express();
app.use(express.json());
app.use(cors());

// Kết nối Database
connectDB();

// Import routes user
const userRouter = require('./routes/user.routes');
app.use('/api/users', userRouter); // định tuyến user API

// Import routes product
const productRoutes = require("./routes/product.routes");
app.use("/api/products", productRoutes);
// Category
const categoryRoutes = require("./routes/category.routes");
app.use("/api/categories", categoryRoutes);

app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
});
