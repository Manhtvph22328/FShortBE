const express = require("express");
const {updateStatusOrder, getOrderByStatus, createOrder, cancelOrder, getAllOrders, getOrderDetail} = require("../controllers/orderController");
const {authMiddleware, isAdmin} = require("../middlewares/authMiddleware");
const router = express.Router();

// Routes cho danh mục
router.post('/create',authMiddleware, createOrder);

router.get('/getAll',authMiddleware ,isAdmin, getAllOrders);

router.get('/getDetail/:id',authMiddleware, getOrderDetail);

router.put('/update/:orderId',authMiddleware ,isAdmin, updateStatusOrder);

router.get('/getByStatus',authMiddleware, getOrderByStatus);

router.put('/cancelOrder',authMiddleware, cancelOrder);

module.exports = router;
