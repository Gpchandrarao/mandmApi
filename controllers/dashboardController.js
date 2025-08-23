import Bill from "../models/Bill.js";
import User from "../models/User.js";

export const getDashboardSummary = async (req, res) => {
  try {
    // Total users
    const totalUsers = await User.countDocuments();

    // Total orders
    const totalOrders = await Bill.countDocuments();

    // Total billing
    const totalBillingAgg = await Bill.aggregate([
      { $group: { _id: null, total: { $sum: "$grandTotal" } } },
    ]);
    const totalBilling = totalBillingAgg[0]?.total || 0;

    // Today's orders & billing
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const todayOrders = await Bill.countDocuments({
      createdAt: { $gte: startOfToday, $lte: endOfToday },
    });

    const todayBillingAgg = await Bill.aggregate([
      { $match: { createdAt: { $gte: startOfToday, $lte: endOfToday } } },
      { $group: { _id: null, total: { $sum: "$grandTotal" } } },
    ]);
    const todayBilling = todayBillingAgg[0]?.total || 0;

    res.json({
      totalUsers,
      totalOrders,
      totalBilling,
      todayOrders,
      todayBilling,
    });
  } catch (err) {
    console.error("Dashboard summary error:", err);
    res.status(500).json({
      message: "Failed to get dashboard summary",
      error: err.message,
    });
  }
};
