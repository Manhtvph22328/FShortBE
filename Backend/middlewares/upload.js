const multer = require('multer');

const storage = multer.memoryStorage(); // Không lưu ảnh vào ổ đĩa, giữ trong RAM

const upload = multer({ storage });

module.exports = upload;
