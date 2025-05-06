const Information = require("../models/information.model");

// Lấy tất cả thông tin theo user
const getAllInformationByUser = async (req, res) => {
    try {
        const userId = req.user.userId;
        const info = await Information.find({ userId });
        return res.status(200).json(info);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error });
    }
};

// Thêm mới
const createInformation = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { name, address, phoneNumber } = req.body;
        let checked = false;
        const count = await Information.countDocuments({ userId });
        if (count < 1) {
            checked = true;
        }
        const information = {
            userId,
            information: {
                name,
                address,
                phoneNumber,
            },
            checked,
        }
        console.log(information);
        const newInfo = new Information(information);

        await newInfo.save();
        return res.status(200).json(newInfo);
    } catch (error) {
        return res.status(400).json({ message: "Tạo mới thất bại", error });
    }
};

// Cập nhật
const updateInformation = async (req, res) => {
    try {
        const infoId = req.params.id;
        const { checked } = req.body;
        const userId = req.user.userId;
        const { name, address, phoneNumber } = req.body;

        const currentInfo = await Information.findOne({
            userId,
            _id : infoId,
        });
        console.log(req.body);
        if (!currentInfo)
            return res.status(404).json({ message: "Không tìm thấy thông tin" });

        if (checked === true) {
            await Information.updateMany(
                { userId: currentInfo.userId, _id: { $ne: infoId } },
                { $set: { checked: false } }
            );
        }

        const updatedInfo = await Information.findByIdAndUpdate(
            infoId,
            {
                information : {
                    name,
                    address,
                    phoneNumber,
                }
            },
            { new: true }
        );

        res.json(updatedInfo);
    } catch (error) {
        res.status(400).json({ message: "Cập nhật thất bại", error });
    }
};

// Đổi địa chỉ mặc định (checked)
const setCheckedInformation = async (req, res) => {
    try {
        const infoId = req.params.id;
        const userId = req.user.userId;
        const currentInfo = await Information.findOne({
            userId,
            _id : infoId,
        });
        if (!currentInfo)
            return res.status(404).json({ message: "Không tìm thấy thông tin" });

        await Information.updateMany(
            { userId: userId },
            { $set: { checked: false } }
        );

        currentInfo.checked = true;
        await currentInfo.save();

        res.json({ message: "Cập nhật địa chỉ mặc định thành công", data: currentInfo });
    } catch (error) {
        res.status(400).json({ message: "Cập nhật thất bại", error });
    }
};

// Xóa
const deleteInformation = async (req, res) => {
    try {
        const infoId = req.params.id;
        const deletedInfo = await Information.findByIdAndDelete(infoId);

        if (!deletedInfo)
            return res.status(404).json({ message: "Không tìm thấy" });

        // Nếu info bị xóa là checked thì set info khác làm mặc định
        if (deletedInfo.checked) {
            const otherInfo = await Information.findOne({ userId: deletedInfo.userId });
            if (otherInfo) {
                otherInfo.checked = true;
                await otherInfo.save();
            }
        }

        res.json({ message: "Xóa thành công" });
    } catch (error) {
        res.status(500).json({ message: "Xóa thất bại", error });
    }
};

module.exports = {
    getAllInformationByUser,
    createInformation,
    updateInformation,
    setCheckedInformation,
    deleteInformation,
};
