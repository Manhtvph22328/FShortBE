const mongoose = require("mongoose");

const infomationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    information: {
        name: {
            type: String, // sửa lại kiểu String
            required: true
        },
        address: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            required: true
        }
    },
    checked : {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true // tự động thêm createdAt và updatedAt
});

// Tên model và schema phải đúng
const Information = mongoose.model('Information', infomationSchema);

module.exports = Information;
