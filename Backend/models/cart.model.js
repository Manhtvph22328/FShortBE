const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                default: 1,
                min: 1
            },
            color : {
                type: String,
                required: true

            },
            size : {
                type: String,
                required: true

            },
            price : {
                type: Number,
                required: true

            },
            checked : {
                type: Boolean,
                default: false
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // tự động thêm createdAt và updatedAt
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart
