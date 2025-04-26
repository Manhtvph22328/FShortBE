const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
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
                required: true,
                default: 1
            },
            color : {
                type: String,
                required: true

            },
            size : {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            isReviewed : {
                type: Boolean,
                default: false
            },
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Processed', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    paymentStatus: {
        type: String,
        enum: ['Unpaid', 'Paid'],
        default: 'Unpaid'
    },
    shippingAddress: {
        name : {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        }
    },
    paymentMethod: {
        type: String,
        enum: ['Momo', 'Cash On Delivery'],
        default: 'Cash On Delivery'
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    statusHistory: [
        {
            status: {
                type: String,
                enum: ['Pending', 'Processed', 'Delivered', 'Cancelled',"Paid"],
                required: true
            },
            date: {
                type: Date,
                default: Date.now
            },
            changedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            }
        }
    ]
});

module.exports = mongoose.model("Order", orderSchema);
