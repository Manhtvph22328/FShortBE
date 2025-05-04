const express = require('express');
const {authMiddleware} = require("../middlewares/authMiddleware");
const {createReview, getReviews} = require("../controllers/review.controller");

const router = express.Router();

router.post('/createReview',authMiddleware, createReview);
router.get('/getReview',authMiddleware, getReviews);

module.exports = router;
