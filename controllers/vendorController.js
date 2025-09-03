import Vendor from "../models/Vendor.js";
// Get all vendors
export const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.status(200).json(vendors);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch vendors", error: err.message });
  }
};

// Create vendor
export const createVendor = async (req, res) => {
  try {
    const vendor = new Vendor(req.body);
    await vendor.save();
    res.status(201).json(vendor);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create vendor", error: err.message });
  }
};

// Update vendor
export const updateVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    res.status(200).json(vendor);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update vendor", error: err.message });
  }
};

// Delete vendor
export const deleteVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    res.status(200).json({ message: "Vendor deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete vendor", error: err.message });
  }
};
