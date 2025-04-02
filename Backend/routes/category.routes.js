const express = require("express");
// const { getCategories, createCategory, updateCategory, deleteCategory } = require("../controllers/category.controller");
const categoryController = require("../controllers/category.controller");
const router = express.Router();

// Routes cho danh mục
router.get('/listCategories', categoryController.getCategories);
router.post('/addCategories', categoryController.createCategory);
router.put("/updateCategories/:id", categoryController.updateCategory);
// router.delete("/deleteCategories/:id", categoryController.deleteCategory);

module.exports = router;
