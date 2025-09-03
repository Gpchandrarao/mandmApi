// import Bill from "../models/Bill.js";

// // Upload a new bill
// export const uploadBill = async (req, res) => {
//   try {
//     const {
//       userName,
//       phoneNumber,
//       paymentType,
//       serverName,
//       billAmount,
//       tips,
//       services,
//       referral,
//       discount,
//       remarks,
//       grandTotal,
//       paymentBreakdown, // ✅ added (for Both payments)
//     } = req.body;

//     const bill = await Bill.create({
//       userName,
//       phoneNumber,
//       paymentType,
//       serverName,
//       billAmount,
//       tips: tips || 0,
//       services,
//       referral: referral || "",
//       discount: discount || 0,
//       remarks: remarks || "",
//       grandTotal: grandTotal || 0,

//       // ✅ only store if Both selected
//       ...(paymentType === "Both" && paymentBreakdown
//         ? { paymentBreakdown }
//         : {}),
//     });

//     console.log("✅ Bill saved:", bill);
//     res.status(201).json({ message: "Bill uploaded successfully", bill });
//   } catch (err) {
//     console.error("❌ Upload bill error:", err.message);
//     res.status(500).json({
//       message: "Failed to upload bill",
//       error: err.message,
//     });
//   }
// };

// // Get all bills
// export const getAllBills = async (req, res) => {
//   try {
//     const bills = await Bill.find().sort({ createdAt: -1 });
//     res.status(200).json(bills);
//   } catch (err) {
//     console.error("❌ Fetch bills error:", err.message);
//     res.status(500).json({
//       message: "Failed to fetch bills",
//       error: err.message,
//     });
//   }
// };

// // Get today's bills only
// export const getTodayBills = async (req, res) => {
//   try {
//     const start = new Date();
//     start.setHours(0, 0, 0, 0);
//     const end = new Date();
//     end.setHours(23, 59, 59, 999);

//     const bills = await Bill.find({
//       createdAt: { $gte: start, $lte: end },
//     }).sort({ createdAt: -1 });

//     res.status(200).json(bills);
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "Failed to fetch today's bills", error: err.message });
//   }
// };

// // Get bills by custom date range
// // /api/bills/range?start=YYYY-MM-DD&end=YYYY-MM-DD
// export const getBillsByDateRange = async (req, res) => {
//   try {
//     const { start, end } = req.query;
//     if (!start || !end) {
//       return res
//         .status(400)
//         .json({ message: "Start and end dates are required" });
//     }

//     const startDate = new Date(start);
//     const endDate = new Date(end);
//     endDate.setHours(23, 59, 59, 999); // include the whole end day

//     const bills = await Bill.find({
//       createdAt: { $gte: startDate, $lte: endDate },
//     }).sort({ createdAt: -1 });

//     res.status(200).json(bills);
//   } catch (err) {
//     res.status(500).json({
//       message: "Failed to fetch bills by date range",
//       error: err.message,
//     });
//   }
// };

// // Get summary: total bills, total amount, total tips
// export const getBillsSummary = async (req, res) => {
//   try {
//     const summary = await Bill.aggregate([
//       {
//         $group: {
//           _id: null,
//           totalBills: { $sum: 1 },
//           totalAmount: { $sum: "$billAmount" },
//           totalTips: { $sum: "$tips" },
//         },
//       },
//     ]);

//     res
//       .status(200)
//       .json(summary[0] || { totalBills: 0, totalAmount: 0, totalTips: 0 });
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "Failed to get bills summary", error: err.message });
//   }
// };

// // Get a single bill by ID
// export const getBillById = async (req, res) => {
//   try {
//     const bill = await Bill.findById(req.params.id);
//     if (!bill) {
//       return res.status(404).json({ message: "Bill not found" });
//     }
//     res.status(200).json(bill);
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "Failed to fetch bill", error: err.message });
//   }
// };

// // Delete a bill by ID
// export const deleteBill = async (req, res) => {
//   try {
//     const bill = await Bill.findByIdAndDelete(req.params.id);
//     if (!bill) {
//       return res.status(404).json({ message: "Bill not found" });
//     }
//     res.status(200).json({ message: "Bill deleted successfully" });
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "Failed to delete bill", error: err.message });
//   }
// };

// // Update a bill by ID
// export const updateBill = async (req, res) => {
//   try {
//     const bill = await Bill.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     if (!bill) {
//       return res.status(404).json({ message: "Bill not found" });
//     }
//     res.status(200).json({ message: "Bill updated successfully", bill });
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "Failed to update bill", error: err.message });
//   }
// };
import Bill from "../models/Bill.js";
import Worker from "../models/Worker.js"; // ✅ NEW

// Upload a new bill
export const uploadBill = async (req, res) => {
  try {
    const {
      userName,
      phoneNumber,
      paymentType,
      serverName,
      billAmount,
      tips,
      services,
      referral,
      discount,
      remarks,
      grandTotal,
      paymentBreakdown, // ✅ added (for Both payments)
    } = req.body;

    const bill = await Bill.create({
      userName,
      phoneNumber,
      paymentType,
      serverName,
      billAmount,
      tips: tips || 0,
      services,
      referral: referral || "",
      discount: discount || 0,
      remarks: remarks || "",
      grandTotal: grandTotal || 0,

      // ✅ only store if Both selected
      ...(paymentType === "Both" && paymentBreakdown
        ? { paymentBreakdown }
        : {}),
    });

    // ✅ Worker update logic
    let worker = await Worker.findOne({ name: serverName });

    if (worker) {
      // find client inside worker
      let client = worker.clients.find((c) => c.clientNumber === phoneNumber);

      if (client) {
        // update existing client
        client.visits += 1;
        client.tips += tips || 0;
        client.discount += Number(discount) || 0;

        services.forEach((s) => {
          client.services.push({
            name: s.key, // you can later map service key → service name
            month: new Date(bill.date).toLocaleString("default", {
              month: "short",
            }),
            year: new Date(bill.date).getFullYear(),
            amount: billAmount,
          });
        });
      } else {
        // create new client for this worker
        worker.clients.push({
          clientName: userName,
          clientNumber: phoneNumber,
          visits: 1,
          tips: tips || 0,
          discount: Number(discount) || 0,
          services: services.map((s) => ({
            name: s.key,
            month: new Date(bill.date).toLocaleString("default", {
              month: "short",
            }),
            year: new Date(bill.date).getFullYear(),
            amount: billAmount,
          })),
        });
      }

      await worker.save();
    } else {
      // if worker not found → create new one
      const newWorker = new Worker({
        name: serverName,
        number: "N/A",
        image: "",
        clients: [
          {
            clientName: userName,
            clientNumber: phoneNumber,
            visits: 1,
            tips: tips || 0,
            discount: Number(discount) || 0,
            services: services.map((s) => ({
              name: s.key,
              month: new Date(bill.date).toLocaleString("default", {
                month: "short",
              }),
              year: new Date(bill.date).getFullYear(),
              amount: billAmount,
            })),
          },
        ],
      });

      await newWorker.save();
    }

    console.log("✅ Bill saved:", bill);
    res.status(201).json({ message: "Bill uploaded successfully", bill });
  } catch (err) {
    console.error("❌ Upload bill error:", err.message);
    res.status(500).json({
      message: "Failed to upload bill",
      error: err.message,
    });
  }
};

// Get all bills
export const getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find().sort({ createdAt: -1 });
    res.status(200).json(bills);
  } catch (err) {
    console.error("❌ Fetch bills error:", err.message);
    res.status(500).json({
      message: "Failed to fetch bills",
      error: err.message,
    });
  }
};

// Get today's bills only
export const getTodayBills = async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const bills = await Bill.find({
      createdAt: { $gte: start, $lte: end },
    }).sort({ createdAt: -1 });

    res.status(200).json(bills);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch today's bills", error: err.message });
  }
};

// Get bills by custom date range
// /api/bills/range?start=YYYY-MM-DD&end=YYYY-MM-DD
export const getBillsByDateRange = async (req, res) => {
  try {
    const { start, end } = req.query;
    if (!start || !end) {
      return res
        .status(400)
        .json({ message: "Start and end dates are required" });
    }

    const startDate = new Date(start);
    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999); // include the whole end day

    const bills = await Bill.find({
      createdAt: { $gte: startDate, $lte: endDate },
    }).sort({ createdAt: -1 });

    res.status(200).json(bills);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch bills by date range",
      error: err.message,
    });
  }
};

// Get summary: total bills, total amount, total tips
export const getBillsSummary = async (req, res) => {
  try {
    const summary = await Bill.aggregate([
      {
        $group: {
          _id: null,
          totalBills: { $sum: 1 },
          totalAmount: { $sum: "$billAmount" },
          totalTips: { $sum: "$tips" },
        },
      },
    ]);

    res
      .status(200)
      .json(summary[0] || { totalBills: 0, totalAmount: 0, totalTips: 0 });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to get bills summary", error: err.message });
  }
};

// Get a single bill by ID
export const getBillById = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }
    res.status(200).json(bill);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch bill", error: err.message });
  }
};

// Delete a bill by ID
export const deleteBill = async (req, res) => {
  try {
    const bill = await Bill.findByIdAndDelete(req.params.id);
    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }
    res.status(200).json({ message: "Bill deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete bill", error: err.message });
  }
};

// Update a bill by ID
export const updateBill = async (req, res) => {
  try {
    const bill = await Bill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }
    res.status(200).json({ message: "Bill updated successfully", bill });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update bill", error: err.message });
  }
};
