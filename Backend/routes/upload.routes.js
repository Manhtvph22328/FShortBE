const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const { cloudinary } = require("../config/cloudinaryConfig");
const streamifier = require('streamifier');

const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Không có ảnh được tải lên" });
        }

        const streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: "fshop"
                    },
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );
                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };

        const result = await streamUpload(req);
        res.status(200).json({ url: result.secure_url });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tải ảnh lên Cloudinary', error });
    }
};

router.post("/", upload.single("image"), uploadImage);

module.exports = router;
