const Vendor = require("../models/vendorModel");

// Get all vendors
exports.getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.getAll();
    if (!vendors.length) {
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { total, vendors } = await Vendor.getAllWithPagination(limit, offset);

    if (!vendors.length) {
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
    if (!query) {
      return res.status(400).json({ success: false, message: "Search query is required" });
    }

    const vendors = await Vendor.search(query);
    if (!vendors.length) {
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
    const vendor = await Vendor.getById(req.params.id);
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
    if (!vendorData.fullname || !vendorData.email || !vendorData.phone || !vendorData.password) {
      return res.status(400).json({ success: false, message: "Missing required vendor details" });
    }

    const vendorId = await Vendor.addVendor(vendorData);
    res.status(201).json({ success: true, message: "Vendor added successfully", vendorId });
  } catch (error) {
    console.error("Error adding vendor:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update vendor details
exports.updateVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const vendorData = req.body;

    const success = await Vendor.updateVendor(id, vendorData);
    if (!success) {
      return res.status(404).json({ success: false, message: "Vendor not found or update failed" });
    }

    res.status(200).json({ success: true, message: "Vendor details updated successfully" });
  } catch (error) {
    console.error("Error updating vendor:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete a vendor
exports.deleteVendor = async (req, res) => {
  try {
    const { id } = req.params;

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
