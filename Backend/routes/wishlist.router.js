const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlist.controller");
const { authMiddleware } = require("../middlewares/authMiddleware"); // middleware kiểm tra token

// Thêm sản phẩm vào wishlist
router.post("/addToWishlist/:productId", authMiddleware, wishlistController.addToWishlist);

// Xóa sản phẩm khỏi wishlist
router.delete("/deleteWishlist/:productId", authMiddleware, wishlistController.removeFromWishlist);

// Lấy danh sách wishlist
router.get("/getWishlist", authMiddleware, wishlistController.getWishlist);

module.exports = router;
