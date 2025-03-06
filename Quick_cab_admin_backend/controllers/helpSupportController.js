const HelpSupport = require("../models/helpSupportModel");

/**
 * @swagger
 * /api/help-support:
 *   get:
 *     summary: Get all help support queries with pagination and search
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by query message, vendor category, name, or contact
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of results per page
 *     responses:
 *       200:
 *         description: Help support queries retrieved successfully
 *       404:
 *         description: No queries found
 */
exports.getAllHelpSupport = async (req, res) => {
  try {
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const { total, helpSupport } = await HelpSupport.getAll(search, page, limit);
    
    if (!helpSupport.length) {
      return res.status(404).json({ success: false, message: "No help support queries found" });
    }

    res.status(200).json({
      success: true,
      message: "Help support queries retrieved successfully",
      totalRecords: total,
      totalPages: Math.ceil(total / limit),
      page,
      limit,
      data: helpSupport,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get a single Help Support query by ID
exports.getHelpSupportById = async (req, res) => {
  try {
    const helpSupport = await HelpSupport.getById(req.params.id);
    
    if (!helpSupport) {
      return res.status(404).json({ success: false, message: "Help support query not found" });
    }

    res.status(200).json({
      success: true,
      message: "Help support query retrieved successfully",
      data: helpSupport,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Add Help Support Query
exports.addHelpSupport = async (req, res) => {
  try {
    const helpSupportId = await HelpSupport.addHelpSupport(req.body);
    res.status(201).json({
      success: true,
      message: "Help support query added successfully",
      helpSupportId,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Update Help Support Query
exports.updateHelpSupport = async (req, res) => {
  try {
    const success = await HelpSupport.updateHelpSupport(req.params.id, req.body);
    if (!success) {
      return res.status(404).json({ success: false, message: "Help Support query not found or not updated" });
    }
    res.status(200).json({ success: true, message: "Help support query updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Delete a Help Support query
exports.deleteHelpSupport = async (req, res) => {
  try {
    const success = await HelpSupport.deleteById(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, message: "Help Support query not found" });
    }
    res.status(200).json({ success: true, message: "Help support query deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
