const Review = require("../models/review.model");
const Order = require("../models/order.model");
const Product = require("../models/product.model");

const createReview = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { productId, orderId, rating, comment } = req.body;

        if (!productId || !orderId || !rating) {
            return res.status(400).json({ message: "Thiếu thông tin đánh giá" });
        }
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Đánh giá phải nằm trong khoảng từ 1 đến 5" });
        }

        const order = await Order.findOne({ _id: orderId, userId }).populate('products.productId');
        if (!order) {
            return res.status(403).json({ message: "Bạn không có quyền đánh giá đơn hàng này" });
        }

        const productIndex = order.products.findIndex(
            (p) => p.productId._id.toString() === productId
        );
        if (productIndex === -1) {
            return res.status(400).json({ message: "Sản phẩm không tồn tại trong đơn hàng" });
        }

        const existingReview = await Review.findOne({ userId, productId, orderId });
        if (existingReview) {
            return res.status(400).json({ message: "Bạn đã đánh giá sản phẩm này trong đơn hàng rồi" });
        }

        const newReview = new Review({ userId, productId, orderId, rating, comment });
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm để cập nhật đánh giá" });
        }

        // Tính lại rating trung bình
        const totalRating = product.rating * product.rateCount + rating;
        product.rateCount += 1;
        product.rating = parseFloat((totalRating / product.rateCount).toFixed(1));

        // Cập nhật isReviewed
        order.products[productIndex].isReviewed = true;

        // Lưu tất cả song song
        await Promise.all([
            newReview.save(),
            product.save(),
            order.save()
        ]);

        return res.status(201).json({ message: "Đánh giá thành công", order: order });

    } catch (error) {
        console.error("Lỗi khi tạo đánh giá:", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

const getReviews = async (req, res) => {
    try {
        const { productId } = req.query;

        if (!productId) {
            return res.status(400).json({ message: "Thiếu productId" });
        }

        // Kiểm tra sản phẩm có tồn tại không
        const productExists = await Product.findById(productId);
        if (!productExists) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }

        // Lấy danh sách đánh giá theo productId, sắp xếp mới nhất đầu tiên
        const reviews = await Review.find({ productId })
            .populate("userId", "fullname avatar") // chỉ lấy tên và avatar người đánh giá
            .sort({ createdAt: -1 });

        return res.status(200).json({ message: "Lấy đánh giá thành công", reviews });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách đánh giá:", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};
module.exports = {
    createReview,
    getReviews
};
