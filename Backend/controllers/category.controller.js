const Category = require("../models/category.model");

// Lấy danh sách danh mục
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh mục" });
    }
};

// Thêm danh mục (Admin)
exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        console.log("Dữ liệu nhận từ frontend:", req.body); // Log dữ liệu nhận được từ frontend

        // Kiểm tra xem danh mục đã tồn tại chưa
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: "Danh mục đã tồn tại!" });
        }

        // Kiểm tra xem tên có hợp lệ không
        if (!name || name.trim() === "") {
            return res.status(400).json({ message: "Tên danh mục không được để trống" });
        }

        // Nếu chưa tồn tại, tạo mới
        const newCategory = new Category({ name });
        await newCategory.save();
        res.status(201).json({ message: "Thêm danh mục thành công!", category: newCategory });
    } catch (error) {
        console.error("Lỗi khi thêm danh mục:", error); // Log chi tiết lỗi
        res.status(500).json({ message: "Lỗi khi thêm danh mục!", error: error.message });
    }
};

// Cập nhật danh mục (Admin)
exports.updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ message: "Cập nhật danh mục thành công", category });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật danh mục" });
    }
};

// Xóa danh mục (Admin)
// exports.deleteCategory = async (req, res) => {
//     try {
//         await Category.findByIdAndDelete(req.params.id);
//         res.json({ message: "Xóa danh mục thành công" });
//     } catch (error) {
//         res.status(500).json({ message: "Lỗi khi xóa danh mục" });
//     }
// };
