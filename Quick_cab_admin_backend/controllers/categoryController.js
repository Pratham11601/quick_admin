const Category = require("../models/categoryModel");

// Get all categories with pagination
exports.getAllCategories = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    // Ensure page and limit are positive numbers
    if (page < 1 || limit < 1) {
      return res.status(400).json({ success: false, message: "Page and limit must be positive integers" });
    }

    const offset = (page - 1) * limit;
    const { total, categories } = await Category.getAllWithPagination(limit, offset);

    res.status(200).json({
      success: true,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: categories || [], // Ensure data is always an array
    });
  } catch (error) {
    console.error("❌ Error fetching categories:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ success: false, message: "Category ID is required" });

    const category = await Category.getById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    console.error(`❌ Error fetching category with ID ${req.params.id}:`, error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Add new category with duplicate check
exports.addCategory = async (req, res) => {
  try {
    const { cat_name } = req.body;
    if (!cat_name) {
      return res.status(400).json({ success: false, message: "Category name is required" });
    }

    // Call model function to add category
    const categoryId = await Category.addCategory(cat_name);

    res.status(201).json({ success: true, message: "Category added successfully", categoryId });
  } catch (error) {
    console.error("❌ Error adding category:", error.message);
    if (error.message === "Category already exists") {
      return res.status(400).json({ success: false, message: "Category already exists" });
    }
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ success: false, message: "Category ID is required" });

    const success = await Category.deleteById(id);
    if (!success) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.status(200).json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    console.error(`❌ Error deleting category with ID ${req.params.id}:`, error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
