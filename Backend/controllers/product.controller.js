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

// Lấy sp danh mục theo tên 
// exports.getProductsByCategory = async (req, res) => {
//     try {
//         const { categoryId } = req.params;
//         if (!categoryId) return res.status(400).json({ message: "Thiếu ID danh mục" });

//         const products = await Product.find({ category_id: categoryId });
//         if (products.length === 0) return res.status(404).json({ message: "Không có sản phẩm nào trong danh mục này" });

//         res.status(200).json(products);
//     } catch (error) {
//         res.status(500).json({ message: "Lỗi server", error: error.message });
//     }
// };

// Lấy top sản phẩm bán chạy nhất
exports.getTopSellingProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ sold: -1 }).limit(10); // Sắp xếp theo số lượng bán giảm dần
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
};

// Tìm kiếm sản phẩm theo tên
exports.searchProducts = async (req, res) => {
    try {
        console.log("Query nhận được:", req.query);

        const { keyword } = req.query;
        if (!keyword) {
            console.log("Lỗi: Không có từ khoá tìm kiếm!");
            return res.status(400).json({ message: "Vui lòng nhập từ khoá tìm kiếm" });
        }

        const products = await Product.find({
            // name_product: { $regex: `^${keyword.trim()}`, $options: 'i' }  // 'i' là cho phép tìm kiếm không phân biệt chữ hoa/thường
            $text: { $search: `"${keyword.trim()}"` },  // Tìm kiếm chính xác từ khóa
            // $text: { $search: keyword }

        });
        console.log("Kết quả tìm kiếm:", products);

        res.json(products);
    } catch (error) {
        console.error("Lỗi server:", error.message, error.stack);
        res.status(500).json({ message: "Lỗi server", error });
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

// Sửa sản phẩm
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) return res.status(404).json({ message: "Sản phẩm không tồn tại" });

        res.json({ message: "Cập nhật sản phẩm thành công", product });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
};

// Xoá sản phẩm
// exports.deleteProduct = async (req, res) => {
//     try {
//         const product = await Product.findByIdAndDelete(req.params.id);
//         if (!product) return res.status(404).json({ message: "Sản phẩm không tồn tại" });

//         res.json({ message: "Xoá sản phẩm thành công" });
//     } catch (error) {
//         res.status(500).json({ message: "Lỗi server" });
//     }
// };
