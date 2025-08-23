import Bill from "../models/Bill.js";
import User from "../models/User.js";

// Month names helper
const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const getDashboardSummary = async (req, res) => {
  try {
    // Total users
    const totalUsers = await User.countDocuments();

    // Total orders
    const totalOrders = await Bill.countDocuments();

    // Total billing
    const totalBillingResult = await Bill.aggregate([
      { $group: { _id: null, total: { $sum: "$billAmount" } } },
    ]);
    const totalBilling = totalBillingResult[0]?.total || 0;

    // Today's orders & billing
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const todayOrders = await Bill.countDocuments({
      createdAt: { $gte: start, $lte: end },
    });

    const todayBillingResult = await Bill.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $group: { _id: null, total: { $sum: "$billAmount" } } },
    ]);
    const todayBilling = todayBillingResult[0]?.total || 0;

    // Day-wise data
    const dayWiseDataRaw = await Bill.aggregate([
      {
        $project: {
          dayOfWeek: { $dayOfWeek: "$createdAt" },
          billAmount: 1,
          tips: 1,
        },
      },
      {
        $group: {
          _id: "$dayOfWeek",
          profit: { $sum: "$billAmount" },
          loss: { $sum: "$tips" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayWiseData = dayWiseDataRaw.map((d) => ({
      day: weekDays[d._id - 1],
      profit: d.profit,
      loss: d.loss,
    }));

    // Month-wise data
    const monthWiseDataRaw = await Bill.aggregate([
      {
        $project: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
          billAmount: 1,
          tips: 1,
        },
      },
      {
        $group: {
          _id: { month: "$month", year: "$year" },
          profit: { $sum: "$billAmount" },
          loss: { $sum: "$tips" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const monthWiseData = monthWiseDataRaw.map((d) => ({
      month: monthNames[d._id.month - 1],
      year: d._id.year,
      profit: d.profit,
      loss: d.loss,
    }));

    // Year-wise data
    const yearWiseDataRaw = await Bill.aggregate([
      {
        $project: {
          year: { $year: "$createdAt" },
          billAmount: 1,
          tips: 1,
        },
      },
      {
        $group: {
          _id: "$year",
          profit: { $sum: "$billAmount" },
          loss: { $sum: "$tips" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const yearWiseData = yearWiseDataRaw.map((d) => ({
      year: d._id,
      profit: d.profit,
      loss: d.loss,
    }));

    res.json({
      totalUsers,
      totalOrders,
      totalBilling,
      todayOrders,
      todayBilling,
      dayWiseData,
      monthWiseData,
      yearWiseData,
    });
  } catch (err) {
    console.error("Dashboard fetch error:", err);
    res.status(500).json({
      message: "Failed to fetch dashboard summary",
      error: err.message,
    });
  }
};
