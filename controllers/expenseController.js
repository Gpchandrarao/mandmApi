import Expense from "../models/Expense.js";
import path from "path";
import fs from "fs";

// Get all expenses
export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 });
    res.status(200).json(expenses);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch expenses", error: err.message });
  }
};

// Create expense with optional image
export const createExpense = async (req, res) => {
  try {
    const { title, amount, category, description, date, paymentMethod } =
      req.body;

    if (!title || !amount || !date) {
      return res
        .status(400)
        .json({ message: "Title, amount, and date are required" });
    }

    let imageUrl = "";
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const expense = await Expense.create({
      title,
      amount,
      category,
      description,
      date,
      paymentMethod,
      imageUrl,
    });

    res.status(201).json(expense);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create expense", error: err.message });
  }
};

// Update expense
export const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json(expense);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update expense", error: err.message });
  }
};

// Delete expense
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    // Delete image from server if exists
    if (expense.imageUrl) {
      const imgPath = path.join("./public", expense.imageUrl);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    res.json({ message: "Expense deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete expense", error: err.message });
  }
};
