// controllers/workersController.js
import Worker from "../models/Worker.js";

// ✅ Get all workers
export const getAllWorkers = async (req, res) => {
  try {
    const workers = await Worker.find();
    res.status(200).json(workers);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch workers", error: err.message });
  }
};

// ✅ Get single worker by ID
export const getWorkerById = async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }
    res.status(200).json(worker);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch worker", error: err.message });
  }
};

// ✅ Delete worker
export const deleteWorker = async (req, res) => {
  try {
    const worker = await Worker.findByIdAndDelete(req.params.id);
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }
    res.status(200).json({ message: "Worker deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete worker", error: err.message });
  }
};

// 🔹 Get Worker Report (monthly sales + client breakdown)
export const getWorkerReport = async (req, res) => {
  try {
    const { id } = req.params;
    const worker = await Worker.findById(id);

    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    // Build monthly sales report
    const monthlySales = {};
    let yearlyTotal = 0;

    worker.clients.forEach((client) => {
      client.services.forEach((service) => {
        const key = `${service.month}-${service.year}`;
        if (!monthlySales[key]) monthlySales[key] = 0;
        monthlySales[key] += service.amount;
        yearlyTotal += service.amount;
      });
    });

    res.status(200).json({
      worker: {
        id: worker._id,
        name: worker.name,
        number: worker.number,
        image: worker.image,
      },
      report: {
        monthlySales,
        yearlyTotal,
      },
      clients: worker.clients,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch worker report",
      error: err.message,
    });
  }
};

// ✅ Create new worker
export const createWorker = async (req, res) => {
  try {
    const { name, number, role, salary, joinDate, status } = req.body;

    // Use uploaded file path
    const image = req.file ? `/uploads/${req.file.filename}` : "";

    const worker = new Worker({
      name,
      number,
      role,
      salary,
      joinDate,
      status,
      image,
    });

    await worker.save();
    res.status(201).json({ message: "Worker created successfully", worker });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create worker", error: err.message });
  }
};

// ✅ Update worker
export const updateWorker = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = `/uploads/${req.file.filename}`;

    const worker = await Worker.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });

    if (!worker) return res.status(404).json({ message: "Worker not found" });

    res.status(200).json({ message: "Worker updated successfully", worker });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update worker", error: err.message });
  }
};
