const SubPackage = require("../models/subPackageModel");

// Get all sub-packages with pagination
exports.getAllSubPackages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { total, packages } = await SubPackage.getAllWithPagination(limit, offset);

    if (!packages.length) {
      return res.status(404).json({ success: false, message: "No sub-packages found" });
    }

    res.status(200).json({
      success: true,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: packages,
    });
  } catch (error) {
    console.error("Error fetching sub-packages:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get sub-package by ID
exports.getSubPackageById = async (req, res) => {
  try {
    const subPackage = await SubPackage.getById(req.params.id);
    if (!subPackage) {
      return res.status(404).json({ success: false, message: "Sub-package not found" });
    }
    res.status(200).json({ success: true, data: subPackage });
  } catch (error) {
    console.error("Error fetching sub-package:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Search sub-packages by any column
exports.searchSubPackage = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ success: false, message: "Search query is required" });
    }

    const packages = await SubPackage.search(query);
    if (!packages.length) {
      return res.status(404).json({ success: false, message: "No sub-packages found" });
    }

    res.status(200).json({ success: true, data: packages });
  } catch (error) {
    console.error("Error searching sub-packages:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Add a new sub-package
exports.addSubPackage = async (req, res) => {
  try {
    const subPackageId = await SubPackage.addSubPackage(req.body);
    res.status(201).json({ success: true, message: "Sub-package added successfully", subPackageId });
  } catch (error) {
    console.error("Error adding sub-package:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update sub-package details
exports.updateSubPackage = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await SubPackage.updateSubPackage(id, req.body);
    if (!success) {
      return res.status(404).json({ success: false, message: "Sub-package not found or not updated" });
    }

    res.status(200).json({ success: true, message: "Sub-package updated successfully" });
  } catch (error) {
    console.error("Error updating sub-package:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete sub-package
exports.deleteSubPackage = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await SubPackage.deleteById(id);
    if (!success) {
      return res.status(404).json({ success: false, message: "Sub-package not found" });
    }

    res.status(200).json({ success: true, message: "Sub-package deleted successfully" });
  } catch (error) {
    console.error("Error deleting sub-package:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
