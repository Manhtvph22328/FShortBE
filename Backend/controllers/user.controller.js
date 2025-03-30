const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const { JWT_SECRET } = require('../config/env');

// Đăng ký User
const registerUser = async (req, res) => {
    try {
        const { username, password, rePassword, fullname, email, phone, role, platform } = req.body;

        if(password >= 6){
            return res.status(400).json({ message: 'Mật khẩu phải trên 6 kí tự!' });
        }
        if (password !== rePassword) {
            return res.status(400).json({ message: 'Mật khẩu nhập lại không khớp!' });
        }

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username hoặc Email đã tồn tại!' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userRole = platform === 'web' ? role || 'user' : 'user';

        const newUser = new User({
            username,
            password: hashedPassword,
            fullname,
            email,
            phone,
            role: userRole
        });

        await newUser.save();
        res.status(201).json({ message: 'Đăng ký thành công!' });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
};

// Đăng nhập User
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Sai tài khoản hoặc mật khẩu!' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Sai tài khoản hoặc mật khẩu!' });
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Đăng nhập thành công!', token });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
};

// Lấy danh sách User
// tí code lấy danh sách ở đây

// Xuất các hàm để sử dụng trong routes
module.exports = {
    registerUser,
    loginUser,
    // hàm lấy list user
};
