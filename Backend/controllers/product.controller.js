const Product = require("../models/product.model");
// console.log("Kiểu dữ liệu Product:", Product);

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

exports.createProduct = async (req, res) => {
    try {
        console.log("Dữ liệu req.body nhận được:", req.body);

        const {
            name_product,
            price,
            sold,
            rating,
            quantity,
            images,
            size,
            color,
            description,
            category, // <-- đây là key thực tế client gửi lên
        } = req.body;

        if (!name_product || !price || !quantity || !images || !category) {
            console.error("Thiếu thông tin sản phẩm:", {
                name_product, price, quantity, images, category
            });
            return res.status(400).json({ message: "Thiếu thông tin sản phẩm" });
        }

        const newProduct = new Product({
            name_product,
            price,
            sold: sold || 0,
            rating: rating || 0,
            quantity,
            images,
            size,
            color,
            description,
            category, // <-- gán đúng field schema luôn
        });

        await newProduct.save();
        res.json({ message: "Thêm sản phẩm thành công", product: newProduct });
    } catch (error) {
        console.error("Lỗi thêm sản phẩm:", error);
        res.status(500).json({ message: "Lỗi thêm sản phẩm", error });
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
