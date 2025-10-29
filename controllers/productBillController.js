import ProductBill from "../models/ProductBill.js";

// Get all bills (optionally by date)
export const getBills = async (req, res) => {
  try {
    const { date } = req.query;
    let filter = {};
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      filter.date = { $gte: start, $lt: end };
    }

    const bills = await ProductBill.find(filter)
      .sort({ date: -1 })
      .populate("products.productId", "name price");

    res.json(bills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create new bill
export const createBill = async (req, res) => {
  try {
    const { customerName, customerMobile, products } = req.body;

    const grandTotal = products.reduce(
      (sum, p) => sum + p.price * p.quantity,
      0
    );

    const bill = await ProductBill.create({
      customerName,
      customerMobile,
      products: products.map((p) => ({
        ...p,
        total: p.price * p.quantity,
      })),
      grandTotal,
    });

    res.status(201).json(bill);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update bill
export const updateBill = async (req, res) => {
  try {
    const bill = await ProductBill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!bill) return res.status(404).json({ message: "Bill not found" });
    res.json(bill);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete bill
export const deleteBill = async (req, res) => {
  try {
    const bill = await ProductBill.findByIdAndDelete(req.params.id);
    if (!bill) return res.status(404).json({ message: "Bill not found" });
    res.json({ message: "Bill deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
