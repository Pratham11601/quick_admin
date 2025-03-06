const db = require("../config/db");

// Get all cities with search and pagination
exports.getAllCities = async (search = "", page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;
    let query = `SELECT SQL_CALC_FOUND_ROWS * FROM cities`;
    let params = [];

    if (search) {
      query += " WHERE city_name LIKE ?";
      params.push(`%${search}%`);
    }

    query += " LIMIT ? OFFSET ?";
    params.push(parseInt(limit), offset);

    const [cities] = await db.execute(query, params);
    const [[{ total }]] = await db.execute("SELECT FOUND_ROWS() AS total");

    return { total, cities };
  } catch (error) {
    throw new Error("Error fetching cities: " + error.message);
  }
};

// Get city by ID
exports.getCityById = async (city_id) => {
  try {
    const [city] = await db.execute("SELECT * FROM cities WHERE city_id = ?", [city_id]);
    return city.length ? city[0] : null;
  } catch (error) {
    throw new Error("Error fetching city: " + error.message);
  }
};

// Add a new city
exports.addCity = async (city_name, state_name) => {
  try {
    const [result] = await db.execute(
      "INSERT INTO cities (city_name, state_name) VALUES (?, ?)",
      [city_name, state_name]
    );
    return { city_id: result.insertId, message: "City added successfully" };
  } catch (error) {
    throw new Error("Error adding city: " + error.message);
  }
};

// Update city details
exports.updateCity = async (city_id, city_name, state_name) => {
  try {
    const [result] = await db.execute(
      "UPDATE cities SET city_name = ?, state_name = ?, updated_at = NOW() WHERE city_id = ?",
      [city_name, state_name, city_id]
    );
    return result.affectedRows > 0 ? { message: "City updated successfully" } : null;
  } catch (error) {
    throw new Error("Error updating city: " + error.message);
  }
};

// Delete city by ID
exports.deleteCity = async (city_id) => {
  try {
    const [result] = await db.execute("DELETE FROM cities WHERE city_id = ?", [city_id]);
    return result.affectedRows > 0 ? { message: "City deleted successfully" } : null;
  } catch (error) {
    throw new Error("Error deleting city: " + error.message);
  }
};
