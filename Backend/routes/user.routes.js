const express = require('express');
const { registerUser, loginUser, getAllUsers } = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh-token', refreshToken);
router.post('/logout', logoutUser);
router.get('/list', authMiddleware, getAllUsers);

module.exports = router;
