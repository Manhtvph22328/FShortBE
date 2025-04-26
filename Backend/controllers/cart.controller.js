const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const addToCart = async (req, res) => {
    try {
        const userId = req.user.userId; // Lấy từ middleware xác thực
        const { productId, quantity, color, size } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!productId || !quantity || !color || !size) {
            return res.status(400).json({ message: 'Thiếu thông tin sản phẩm' });
        }

        // Kiểm tra quantity phải là một số lớn hơn 0
        if (quantity <= 0) {
            return res.status(400).json({ message: 'Số lượng sản phẩm phải lớn hơn 0' });
        }

        console.log(req.body);

        // Lấy giá sản phẩm từ DB
        const product = await Product.findById(productId).select('price');
        if (!product) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }
        const price = product.price;

        // Tìm giỏ hàng của người dùng
        let cart = await Cart.findOne({ userId })

        if (!cart) {
            // Nếu chưa có giỏ hàng, tạo mới
            cart = new Cart({
                userId,
                products: [{ productId, quantity, color, size, price }]
            });
        } else {
            // Tìm xem sản phẩm đã có trong giỏ chưa
            const existingProductIndex = cart.products.findIndex(
                (p) =>
                    p.productId.toString() === productId &&
                    p.color === color &&
                    p.size === size
            );

            if (existingProductIndex > -1) {
                // Nếu có thì tăng số lượng
                cart.products[existingProductIndex].quantity += quantity;
            } else {
                // Nếu chưa có thì thêm mới
                cart.products.unshift({ productId, quantity, color, size, price });
            }
        }

        // Lưu giỏ hàng đã cập nhật
        await cart.save();
        const updatedCart = await Cart.findOne({ userId })
            .populate('products.productId', 'name_product images price')

        return res.status(200).json({ message: 'Đã thêm vào giỏ hàng', cart: updatedCart });

    } catch (err) {
        console.error('Lỗi khi thêm vào giỏ hàng:', err);
        return res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};

const getCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        // Find the cart for the current user
        let cart;
        cart = await Cart.findOne({ userId })
            .populate('products.productId', 'name_product images price');

        if (!cart) {
            cart = new Cart({
                userId, products: []
            })
            await cart.save()
        }

        // Send the cart data back
        return res.status(200).json({ message: 'Lấy giỏ hàng thành công', cart });

    } catch (e) {
        console.error('Có lỗi xảy ra ở lấy giỏ hàng:', e);
        return res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};


const updateCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { productInCart, quantity, checked } = req.body;

        if (!productInCart || quantity === undefined) {
            return res.status(400).json({ message: 'Thiếu thông tin productInCart hoặc quantity' });
        }

        // Tìm giỏ hàng của người dùng
        let cart = await Cart.findOne({ userId }).populate('products.productId', 'name_product images price')

        if (!cart) {
            return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });
        }

        // Tìm sản phẩm trong giỏ hàng bằng _id trong mảng products
        const productIndex = cart.products.findIndex(
            (p) => p._id.toString() === productInCart
        );

        if (productIndex === -1) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại trong giỏ hàng' });
        }

        if (quantity === 0) {
            // Xóa sản phẩm khỏi giỏ hàng nếu số lượng là 0
            cart.products.splice(productIndex, 1);
        } else {
            // Cập nhật số lượng
            cart.products[productIndex].quantity = quantity;
            cart.products[productIndex].checked = checked;
        }

        await cart.save();

        return res.status(200).json({ message: 'Cập nhật giỏ hàng thành công', cart });

    } catch (e) {
        console.error('Có lỗi xảy ra khi cập nhật giỏ hàng:', e);
        return res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};


module.exports = {
    addToCart,
    getCart,
    updateCart,
}
