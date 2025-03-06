const Vendor = require("../models/vendorModel");

// Get all vendors
exports.getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.getAll();
    if (!vendors || vendors.length === 0) {
      return res.status(404).json({ success: false, message: "No vendors found" });
    }
    res.status(200).json({ success: true, data: vendors });
  } catch (error) {
    console.error("Error fetching vendors:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get vendors with pagination
exports.getVendorsWithPagination = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const { total, vendors } = await Vendor.getAllWithPagination(limit, offset);

    if (!vendors || vendors.length === 0) {
      return res.status(404).json({ success: false, message: "No vendors found" });
    }

    res.status(200).json({
      success: true,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: vendors,
    });
  } catch (error) {
    console.error("Error fetching paginated vendors:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Search vendors by name, email, phone, or business name
exports.searchVendor = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || query.trim() === "") {
      return res.status(400).json({ success: false, message: "Search query is required" });
    }

    const vendors = await Vendor.search(query.trim());
    if (!vendors || vendors.length === 0) {
      return res.status(404).json({ success: false, message: "No vendors found" });
    }

    res.status(200).json({ success: true, data: vendors });
  } catch (error) {
    console.error("Error searching vendors:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get vendor by ID
exports.getVendorById = async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid vendor ID" });
    }

    const vendor = await Vendor.getById(id);
    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }
    res.status(200).json({ success: true, data: vendor });
  } catch (error) {
    console.error("Error fetching vendor by ID:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Add a new vendor
exports.addVendor = async (req, res) => {
  try {
    const vendorData = req.body;
    const requiredFields = ["fullname", "email", "phone", "password"];

    for (const field of requiredFields) {
      if (!vendorData[field]) {
        return res.status(400).json({ success: false, message: `${field} is required` });
      }
    }

    const vendorId = await Vendor.addVendor(vendorData);
    res.status(201).json({ success: true, message: "Vendor added successfully", vendorId });
  } catch (error) {
    console.error("Error adding vendor:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update vendor status
exports.updateVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid vendor ID" });
    }

    if (status === undefined) {
      return res.status(400).json({ success: false, message: "Status field is required" });
    }

    const result = await Vendor.updateVendor(id, status);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Vendor not found or update failed" });
    }

    res.status(200).json({ success: true, message: "Vendor status updated successfully" });
  } catch (error) {
    console.error("Error updating vendor status:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete a vendor
exports.deleteVendor = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid vendor ID" });
    }

    const success = await Vendor.deleteById(id);
    if (!success) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    res.status(200).json({ success: true, message: "Vendor deleted successfully" });
  } catch (error) {
    console.error("Error deleting vendor:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
