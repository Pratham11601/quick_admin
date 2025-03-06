const db = require("../config/db");

// Get all categories with pagination
exports.getAllWithPagination = async (limit, offset) => {
  try {
    const query = `
      SELECT SQL_CALC_FOUND_ROWS * FROM category 
      ORDER BY id DESC 
      LIMIT ? OFFSET ?;
    `;
    
    const [categories] = await db.execute(query, [limit, offset]);
    const [[{ total }]] = await db.execute("SELECT FOUND_ROWS() AS total");

    return { total, categories };
  } catch (error) {
    console.error("❌ Error fetching categories:", error.message);
    throw new Error("Database error while fetching categories.");
  }
};

// Get category by ID
exports.getById = async (id) => {
  try {
    const [rows] = await db.execute("SELECT * FROM category WHERE id = ?", [id]);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error(`❌ Error fetching category with ID ${id}:`, error.message);
    throw new Error("Database error while fetching category.");
  }
};

// Add a new category with duplicate check
exports.addCategory = async (cat_name) => {
  try {
    // Check if category already exists (case-insensitive)
    const [existingCategory] = await db.execute("SELECT * FROM category WHERE LOWER(cat_name) = LOWER(?)", [cat_name]);
    
    if (existingCategory.length > 0) {
      throw new Error("Category already exists");
    }

    // Insert new category
    const [result] = await db.execute("INSERT INTO category (cat_name) VALUES (?)", [cat_name]);
    return result.insertId;
  } catch (error) {
    console.error("❌ Error adding category:", error.message);
    throw new Error(error.message); // Pass error message to controller
  }
};

// Delete category by ID
exports.deleteById = async (id) => {
  try {
    const [result] = await db.execute("DELETE FROM category WHERE id = ?", [id]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error(`❌ Error deleting category with ID ${id}:`, error.message);
    throw new Error("Database error while deleting category.");
  }
};
