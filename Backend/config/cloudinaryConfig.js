const {CLOUD_NAME_cloudinary, API_KEY_cloudinary, API_SECRET_cloudinary} = require("./env");
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: CLOUD_NAME_cloudinary,
    api_key: API_KEY_cloudinary,
    api_secret: API_SECRET_cloudinary,
});
module.exports = {cloudinary}
