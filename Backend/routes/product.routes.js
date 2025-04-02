const express = require("express");
// const { getProducts, searchProducts, getProductById, createProduct, updateProduct, deleteProduct } = require("../controllers/product.controller");
const productController = require("../controllers/product.controller");
const router = express.Router();

// Routes cho sản phẩm
router.get("/listProducts", productController.getAllProducts);
router.get("/category/:categoryId", productController.getProductsByCategory);
router.get("/top-selling-product", productController.getTopSellingProducts);
router.get("/searchProducts", productController.searchProducts);
router.post("/addProducts", productController.createProduct);
router.put("/updateProducts/:id", productController.updateProduct);
// router.delete("/deleteProducts/:id", productController.deleteProduct);


module.exports = router;
