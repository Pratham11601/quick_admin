const Leads = require("../models/leadsModel");

// ✅ Create a new lead
exports.createLead = async (req, res) => {
  try {
    const lead = await Leads.create(req.body);
    res.status(201).json({ success: true, message: "Lead added successfully", data: lead });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get all leads with search and pagination
exports.getLeads = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", receivedOn, tripDate } = req.query;
    const leads = await Leads.getAll({ page: parseInt(page), limit: parseInt(limit), search, receivedOn, tripDate });
    res.status(200).json({
      success: true,
      message: "Leads retrieved successfully",
      data: leads
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get lead by ID
exports.getLeadById = async (req, res) => {
  try {
    const lead = await Leads.getById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }
    res.status(200).json({ success: true, message: "Lead retrieved successfully", data: lead });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update lead
exports.updateLead = async (req, res) => {
  try {
    const result = await Leads.update(req.params.id, req.body);
    if (!result) {
      return res.status(404).json({ success: false, message: "Lead not found or no changes made" });
    }
    res.status(200).json({ success: true, message: "Lead updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete lead
exports.deleteLead = async (req, res) => {
  try {
    const result = await Leads.delete(req.params.id);
    if (!result) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }
    res.status(200).json({ success: true, message: "Lead deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
