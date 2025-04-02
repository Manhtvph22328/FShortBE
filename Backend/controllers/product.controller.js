const Product = require("../models/product.model");

// Lấy danh sách tất cả sản phẩm
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
};

// Lấy danh sách sản phẩm theo danh mục
exports.getProductsByCategory = async (req, res) => {
    try {
        const products = await Product.find({ category_id: req.params.categoryId });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
};

// Thêm sản phẩm mới
exports.createProduct = async (req, res) => {
    try {
        const { name_product, price, sold, rating, quantity, images, size, color, description, category_id } = req.body;
        if (!name_product || !price || !category_id) return res.status(400).json({ message: "Thiếu thông tin sản phẩm" });

        const newProduct = new Product({
            name_product, price, sold, rating, quantity, images, size, color, description, category_id
        });

        await newProduct.save();
        res.json({ message: "Thêm sản phẩm thành công", product: newProduct });
    } catch (error) {
        res.status(500).json({ message: "Lỗi thêm sản phẩm: ", error });
    }
};

// bên dưới xử lý sửa, tìm theo tên sp, lấy top sp cho danh mục bán chạy