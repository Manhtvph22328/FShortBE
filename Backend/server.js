require('dotenv').config();
console.log("JWT_SECRET từ .env:", process.env.JWT_SECRET);
console.log("REFRESH_TOKEN_SECRET từ .env:", process.env.REFRESH_TOKEN_SECRET);

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');  // Import connectDB
const { PORT } = require('./config/env');  // Import PORT từ env.js
const path = require('path');

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
// Cart
const cartRoutes = require("./routes/cart.routes");
app.use("/api/cart", cartRoutes);
// Order
const orderRoutes = require("./routes/order.routes");
app.use("/api/order", orderRoutes);

// Cho phép truy cập ảnh trong thư mục uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads_img')));

// Cho phép truy cập ảnh trong thư mục uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads_img')));

// Route upload
const uploadRoute = require('./routes/upload.routes');
const http = require("node:http");
app.use("/api/upload", uploadRoute);
// Routes review
const reviewRoutes = require("./routes/review.routes");
app.use("/api/review", reviewRoutes);
// routes payment momo
const momoRoutes = require("./routes/momo.routes");
app.use("/api/momo", momoRoutes);

// check lỗi 
app._router.stack.forEach((r) => {
    if (r.route && r.route.path) {
        console.log(r.route.path);
    }
});

app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
});
