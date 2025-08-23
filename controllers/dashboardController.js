// controllers/dashboardController.js
import Bill from "../models/Bill.js";

// ✅ Updated Dashboard Summary with monthNames
export const getDashboardSummary = async (req, res) => {
  try {
    const totalBills = await Bill.countDocuments();

    const totalAmountAgg = await Bill.aggregate([
      { $group: { _id: null, total: { $sum: "$grandTotal" } } }, // ✅ use grandTotal
    ]);
    const totalAmount = totalAmountAgg[0]?.total || 0;

    const totalTipsAgg = await Bill.aggregate([
      { $group: { _id: null, total: { $sum: "$tips" } } },
    ]);
    const totalTips = totalTipsAgg[0]?.total || 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayBills = await Bill.countDocuments({
      createdAt: { $gte: today },
    });

    // ✅ Monthly totals (with month names)
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const monthlyData = await Bill.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalAmount: { $sum: "$grandTotal" },
          totalBills: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const monthlySummary = monthlyData.map((item) => ({
      month: monthNames[item._id - 1],
      totalAmount: item.totalAmount,
      totalBills: item.totalBills,
    }));

    res.json({
      totalBills,
      totalAmount,
      totalTips,
      todayBills,
      monthlySummary,
    });
  } catch (error) {
    console.error("Dashboard summary error:", error);
    res.status(500).json({ message: "Failed to get dashboard summary" });
  }
};
