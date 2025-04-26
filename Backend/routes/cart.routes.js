const express = require("express");
const { addToCart, updateCart, getCart } = require("../controllers/cart.controller");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

// Routes cho danh mục
router.post('/addToCart', authMiddleware, addToCart);

router.put('/updateCart', authMiddleware, updateCart);

router.get('/getCart', authMiddleware, getCart);

module.exports = router;
