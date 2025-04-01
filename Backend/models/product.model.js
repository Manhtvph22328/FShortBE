const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    name_product: { type: String, required: true },
    price: { type: Number, required: true },
    sold: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    quantity: { type: Number, required: true },
    images: { type: [String], required: true },
    size: { type: [String], enum: ["S", "M", "L", "XL"] },
    color: { type: [String] },
    description: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }
}, { timestamps: true });

// Tạo chỉ mục văn bản cho trường 'name_product'
ProductSchema.index({ name_product: 'text' });

module.exports = mongoose.model("Product", ProductSchema);
