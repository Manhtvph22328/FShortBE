const express = require("express");
const router = require("express").Router();
const moment = require("moment");
const Order = require("../models/order.model");

// Hàm lấy khoảng thời gian theo timeframe
const getDateRange = (timeframe) => {
    const now = moment();
    switch (timeframe) {
        case "week":
            return {
                startDate: now.clone().startOf("week").toDate(),
                endDate: now.clone().endOf("week").toDate(),
            };
        case "month":
            return {
                startDate: now.clone().startOf("year").toDate(),
                endDate: now.clone().endOf("year").toDate(),
            };
        case "year":
            return {
                startDate: now.clone().subtract(4, "years").startOf("year").toDate(),
                endDate: now.clone().endOf("year").toDate(),
            };
        default:
            return {
                startDate: now.clone().startOf("day").toDate(),
                endDate: now.clone().endOf("day").toDate(),
            };
    }
};

router.get("/stats-by-timeframe", async (req, res) => {
    const { timeframe = "week" } = req.query;

    try {
        const { startDate, endDate } = getDateRange(timeframe);

        // Tùy theo timeframe mà group theo field nào
        let groupStage = {};
        if (timeframe === "week" || timeframe === "day") {
            groupStage = {
                _id: {
                    year: { $year: "$orderDate" },
                    month: { $month: "$orderDate" },
                    day: { $dayOfMonth: "$orderDate" },
                },
                totalRevenue: { $sum: "$totalAmount" },
                totalOrders: { $sum: 1 },
            };
        } else if (timeframe === "month") {
            groupStage = {
                _id: {
                    year: { $year: "$orderDate" },
                    month: { $month: "$orderDate" },
                },
                totalRevenue: { $sum: "$totalAmount" },
                totalOrders: { $sum: 1 },
            };
        } else if (timeframe === "year") {
            groupStage = {
                _id: {
                    year: { $year: "$orderDate" },
                },
                totalRevenue: { $sum: "$totalAmount" },
                totalOrders: { $sum: 1 },
            };
        }

        // Lấy dữ liệu từ MongoDB
        const stats = await Order.aggregate([
            {
                $match: {
                    status: "Delivered",
                    orderDate: { $gte: startDate, $lte: endDate },
                },
            },
            { $group: groupStage },
        ]);

        // Tạo kết quả thống kê theo khoảng thời gian
        const results = [];
        let current = moment(startDate);
        const end = moment(endDate);

        while (current <= end) {
            let match;

            if (timeframe === "week" || timeframe === "day") {
                match = stats.find(
                    s =>
                        s._id.year === current.year() &&
                        s._id.month === current.month() + 1 &&
                        s._id.day === current.date()
                );
                results.push({
                    _id: {
                        year: current.year(),
                        month: current.month() + 1,
                        day: current.date(),
                    },
                    totalRevenue: match ? match.totalRevenue : 0,
                    totalOrders: match ? match.totalOrders : 0,
                });
                current.add(1, "day");

            } else if (timeframe === "month") {
                match = stats.find(
                    s =>
                        s._id.year === current.year() &&
                        s._id.month === current.month() + 1
                );
                results.push({
                    _id: {
                        year: current.year(),
                        month: current.month() + 1,
                    },
                    totalRevenue: match ? match.totalRevenue : 0,
                    totalOrders: match ? match.totalOrders : 0,
                });
                current.add(1, "month");

            } else if (timeframe === "year") {
                match = stats.find(s => s._id.year === current.year());
                results.push({
                    _id: {
                        year: current.year(),
                    },
                    totalRevenue: match ? match.totalRevenue : 0,
                    totalOrders: match ? matchx.totalOrders : 0,
                });
                current.add(1, "year");
            }
        }

        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi thống kê theo thời gian" });
    }
});



// API: Thống kê sản phẩm bán chạy theo tuần, tháng, năm
router.get("/top-products-by-timeframe", async (req, res) => {
    const { timeframe = "day" } = req.query;

    try {
        const { startDate, endDate } = getDateRange(timeframe);

        const topProducts = await Order.aggregate([
            { $unwind: "$products" },
            {
                $match: {
                    orderDate: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $group: {
                    _id: "$products.productId",
                    totalSold: { $sum: "$products.quantity" },
                },
            },
            { $sort: { totalSold: -1 } },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "productDetails",
                },
            },
            { $unwind: "$productDetails" },
            {
                $project: {
                    name: "$productDetails.name_product",
                    totalSold: 1,
                    price: "$productDetails.price",
                    image: { $arrayElemAt: ["$productDetails.images", 0] },
                    revenue: { $multiply: ["$totalSold", "$productDetails.price"] },
                },
            },
        ]);

        res.status(200).json(topProducts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi thống kê sản phẩm bán chạy theo thời gian" });
    }
});



module.exports = router;
