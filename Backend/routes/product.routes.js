
const express = require("express");
// const { getProducts, searchProducts, getProductById, createProduct, updateProduct, deleteProduct } = require("../controllers/product.controller");
const productController = require("../controllers/product.controller");
const router = express.Router();

// Routes cho sản phẩm
router.get("/listProducts", productController.getAllProducts);
router.get("/category/:categoryId", productController.getProductsByCategory);
router.post("/addProducts", productController.createProduct);