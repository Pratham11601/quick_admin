const db = require("../config/db");

// Get all sub-packages with pagination
exports.getAllWithPagination = async (limit, offset) => {
  try {
    const [totalRows] = await db.query("SELECT COUNT(*) AS total FROM sub_packages");
    const total = totalRows[0].total;

    const [rows] = await db.query(
      "SELECT * FROM sub_packages ORDER BY createdAt DESC LIMIT ? OFFSET ?",
      [limit, offset]
    );

    return { total, packages: rows };
  } catch (error) {
    throw error;
  }
};

// Get sub-package by ID
exports.getById = async (id) => {
  try {
    const [rows] = await db.query("SELECT * FROM sub_packages WHERE id = ?", [id]);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    throw error;
  }
};

// Search sub-packages by any column
exports.search = async (query) => {
  try {
    const searchQuery = `%${query}%`;
    const [rows] = await db.query(
      `SELECT * FROM sub_packages 
       WHERE package_name LIKE ? OR price_per_day LIKE ? OR total_price LIKE ?`,
      [searchQuery, searchQuery, searchQuery]
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

// Add a new sub-package
exports.addSubPackage = async (packageData) => {
  try {
    const { package_name, duration_in_days, price_per_day, total_price } = packageData;
    const [result] = await db.query(
      "INSERT INTO sub_packages (package_name, duration_in_days, price_per_day, total_price, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())",
      [package_name, duration_in_days, price_per_day, total_price]
    );
    return result.insertId;
  } catch (error) {
    throw error;
  }
};

// Update sub-package details
exports.updateSubPackage = async (id, packageData) => {
  try {
    const { package_name, duration_in_days, price_per_day, total_price } = packageData;
    const [result] = await db.query(
      "UPDATE sub_packages SET package_name = ?, duration_in_days = ?, price_per_day = ?, total_price = ?, updatedAt = NOW() WHERE id = ?",
      [package_name, duration_in_days, price_per_day, total_price, id]
    );
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};

// Delete sub-package by ID
exports.deleteById = async (id) => {
  try {
    const [result] = await db.query("DELETE FROM sub_packages WHERE id = ?", [id]);
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};
