const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const createOrder = async (req, res) => {
    try {
        const { shippingAddress, paymentMethod } = req.body;
        const userId = req.user.userId;
        // Kiểm tra thông tin bắt buộc
        if (!shippingAddress || !paymentMethod) {
            return res.status(400).json({ message: 'Thiếu thông tin đơn hàng' });
        }

        // Lấy giỏ hàng của người dùng
        const cart = await Cart.findOne({ userId });
        if (!cart || !cart.products || cart.products.length === 0) {
            return res.status(404).json({ message: 'Giỏ hàng không tồn tại hoặc rỗng' });
        }

        // Lọc sản phẩm có checked: true
        const selectedProducts = cart.products.filter(item => item.checked === true);

        if (selectedProducts.length === 0) {
            return res.status(400).json({ message: 'Không có sản phẩm nào được chọn để đặt hàng' });
        }
        for (const item of selectedProducts) {
            const product = await Product.findById(item.productId); // Lấy thông tin sản phẩm từ cơ sở dữ liệu
            if (!product) {
                return res.status(404).json({ message: `Sản phẩm ${item.productId} không tồn tại` });
            }

            if (product.quantity < item.quantity) {
                return res.status(400).json({
                    message: `Sản phẩm ${product.name_product} không đủ số lượng. Chỉ còn ${product.quantity} sản phẩm trong kho.`
                });
            }
        }

        // Tính tổng tiền
        let totalAmount = 0;
        for (const item of selectedProducts) {
            totalAmount += item.price * item.quantity;
        }

        // Tạo đơn hàng mới
        const newOrder = new Order({
            userId,
            products: selectedProducts,
            totalAmount,
            shippingAddress: shippingAddress,
            paymentMethod,
            statusHistory: {
                status: 'Pending',
                changedBy: userId,
            },
        });

        await newOrder.save();

        // Cập nhật lại giỏ hàng, loại bỏ các sản phẩm đã đặt
        cart.products = cart.products.filter(item => item.checked !== true);
        await cart.save();

        return res.status(201).json({ message: 'Tạo đơn hàng thành công', order: newOrder });
    } catch (e) {
        console.error('Lỗi khi tạo đơn hàng:', e);
        return res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};

const getOrderByStatus = async (req, res) => {
    try {
        const { status } = req.query;
        const userId = req.user.userId;

        if (!status) {
            return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
        }

        let orders;

        if (status === 'All') {
            // Nếu trạng thái là 'All', lấy tất cả đơn hàng của người dùng
            orders = await Order.find({ userId: userId })
                .populate({
                    path: 'products.productId',
                    select: 'name_product images price' // Chỉ lấy các trường cần thiết từ sản phẩm
                })
        } else {
            // Nếu có trạng thái cụ thể, lấy đơn hàng theo trạng thái
            orders = await Order.find({
                userId: userId,
                status: status
            })
                .populate({
                    path: 'products.productId',
                    select: 'name_product images price' // Chỉ lấy các trường cần thiết từ sản phẩm
                })
        }

        return res.status(200).json({ message: 'Danh sách đơn hàng', orders });

    } catch (e) {
        console.error('Lỗi khi lấy đơn hàng theo trạng thái:', e);
        return res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const { search, status, fromDate, toDate } = req.query;

        let filter = {};

        // Tìm theo tên hoặc số điện thoại
        if (search) {
            filter.$or = [
                { 'shippingAddress.name': { $regex: search, $options: 'i' } },
                { 'shippingAddress.phoneNumber': { $regex: search, $options: 'i' } }
            ];
        }

        // Lọc theo trạng thái
        if (status) {
            filter.status = status;
        }

        // Lọc theo khoảng thời gian orderDate
        if (fromDate || toDate) {
            filter.orderDate = {};
            if (fromDate) {
                filter.orderDate.$gte = new Date(fromDate);
            }
            if (toDate) {
                filter.orderDate.$lte = new Date(toDate);
            }
        }

        console.log('Filter:', filter);

        const orders = await Order.find(filter)
            .sort({ orderDate: -1 })
            .select('shippingAddress.name shippingAddress.phoneNumber status orderDate totalAmount')
            .lean();

        return res.status(200).json(orders);
    } catch (e) {
        console.error('Lỗi khi lấy danh sách đơn hàng:', e);
        return res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};
const getOrderDetail = async (req, res) => {
    try {
        const orderId = req.params.id;

        const order = await Order.findById(orderId)
            .populate('products.productId', 'name_product images')
            .populate('userId', 'fullname avatar')
            .populate('statusHistory.changedBy', 'fullname avatar')
            .lean();

        if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });

        return res.status(200).json(order);
    } catch (e) {
        console.error('Lỗi khi lấy chi tiết đơn hàng:', e);
        return res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};


module.exports = {
    getOrderByStatus,
    createOrder,
    getAllOrders,
    getOrderDetail
};