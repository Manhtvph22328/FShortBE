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

        // Kiểm tra xem danh mục đã tồn tại chưa
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: "Danh mục đã tồn tại!" });
        }

        // Nếu chưa tồn tại, tạo mới
        const newCategory = new Category({ name });
        await newCategory.save();
        res.status(201).json({ message: "Thêm danh mục thành công!", category: newCategory });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi thêm danh mục!", error });
    }
};
// bên dưới xử lý sửa danh mục