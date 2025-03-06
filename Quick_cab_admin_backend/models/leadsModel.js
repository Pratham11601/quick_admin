const pool = require("../config/db"); // Import your connection pool

const Leads = {
  // ✅ Create a new lead
  create: async (leadData) => {
    try {
      const sql = `INSERT INTO leads (date, vendor_id, vendor_name, location_from, location_from_area, car_model, add_on, fare, to_location, to_location_area, time, vendor_contact, vendor_cat) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const values = [
        leadData.date, leadData.vendor_id, leadData.vendor_name, leadData.location_from,
        leadData.location_from_area, leadData.car_model, leadData.add_on, leadData.fare,
        leadData.to_location, leadData.to_location_area, leadData.time, leadData.vendor_contact,
        leadData.vendor_cat
      ];

      const [result] = await pool.execute(sql, values); // Use pool.execute for query execution
      return { id: result.insertId, ...leadData };
    } catch (error) {
      throw new Error("Error creating lead: " + error.message);
    }
  },

  // ✅ Get all leads with search and pagination
  getAll: async ({ page, limit, search, receivedOn, tripDate }) => {
    try {
      let sql = `SELECT * FROM leads WHERE 1=1`;
      let values = [];

      // 🔹 Search feature
      if (search) {
        sql += ` AND (vendor_name LIKE ? OR vendor_contact LIKE ? OR location_from LIKE ? OR to_location LIKE ? OR vendor_cat LIKE ?)`;
        const searchPattern = `%${search}%`;
        values.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
      }

      // 🔹 Filter by "Received On"
      if (receivedOn) {
        sql += ` AND createdAt >= ?`;
        values.push(receivedOn);
      }

      // 🔹 Filter by "Trip Date"
      if (tripDate) {
        sql += ` AND date = ?`;
        values.push(tripDate);
      }

      // 🔹 Pagination
      sql += ` ORDER BY createdAt DESC LIMIT ?, ?`;
      values.push((page - 1) * limit, parseInt(limit));

      const [rows] = await pool.execute(sql, values); // Execute query
      return rows;
    } catch (error) {
      throw new Error("Error fetching leads: " + error.message);
    }
  },

  // ✅ Get lead by ID
  getById: async (id) => {
    try {
      const sql = `SELECT * FROM leads WHERE id = ?`;
      const [rows] = await pool.execute(sql, [id]); // Execute query
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw new Error("Error fetching lead by ID: " + error.message);
    }
  },

  // ✅ Update lead
  update: async (id, leadData) => {
    try {
      const sql = `UPDATE leads SET date = ?, vendor_id = ?, vendor_name = ?, location_from = ?, location_from_area = ?, car_model = ?, add_on = ?, fare = ?, to_location = ?, to_location_area = ?, time = ?, vendor_contact = ?, vendor_cat = ? WHERE id = ?`;
      const values = [
        leadData.date, leadData.vendor_id, leadData.vendor_name, leadData.location_from,
        leadData.location_from_area, leadData.car_model, leadData.add_on, leadData.fare,
        leadData.to_location, leadData.to_location_area, leadData.time, leadData.vendor_contact,
        leadData.vendor_cat, id
      ];

      const [result] = await pool.execute(sql, values); // Execute query
      return result.affectedRows > 0 ? { message: "Lead updated successfully" } : null;
    } catch (error) {
      throw new Error("Error updating lead: " + error.message);
    }
  },

  // ✅ Delete lead
  delete: async (id) => {
    try {
      const sql = `DELETE FROM leads WHERE id = ?`;
      const [result] = await pool.execute(sql, [id]); // Execute query
      return result.affectedRows > 0 ? { message: "Lead deleted successfully" } : null;
    } catch (error) {
      throw new Error("Error deleting lead: " + error.message);
    }
  }
};

module.exports = Leads;
