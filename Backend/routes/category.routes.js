const express = require("express");
// const { getProducts, searchProducts, getProductById, createProduct, updateProduct, deleteProduct } = require("../controllers/product.controller");
const productController = require("../controllers/product.controller");
const router = express.Router();

// Routes cho sản phẩm
router.get("/products", productController.getAllProducts);
router.post('/addCategories', categoryController.createCategory);