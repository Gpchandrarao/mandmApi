import VendorBill from "../models/VendorBill.js";

// ➕ Create Vendor Bill
export const createVendorBill = async (req, res) => {
  try {
    const { vendorName, vendorContact, items } = req.body;

    if (!vendorName || !items || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Vendor name and items required" });
    }

    const grandTotal = items.reduce((sum, i) => sum + i.total, 0);
    const newBill = new VendorBill({
      vendorName,
      vendorContact,
      items,
      grandTotal,
    });

    await newBill.save();
    res.status(201).json(newBill);
  } catch (error) {
    console.error("Error creating vendor bill:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// 📜 Get All Vendor Bills
export const getVendorBills = async (req, res) => {
  try {
    const bills = await VendorBill.find().sort({ createdAt: -1 });
    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bills", error });
  }
};

// ✏️ Update Vendor Bill
export const updateVendorBill = async (req, res) => {
  try {
    const bill = await VendorBill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!bill) return res.status(404).json({ message: "Bill not found" });
    res.status(200).json(bill);
  } catch (error) {
    res.status(500).json({ message: "Error updating bill", error });
  }
};

// ❌ Delete Vendor Bill
export const deleteVendorBill = async (req, res) => {
  try {
    const bill = await VendorBill.findByIdAndDelete(req.params.id);
    if (!bill) return res.status(404).json({ message: "Bill not found" });
    res.status(200).json({ message: "Bill deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting bill", error });
  }
};
