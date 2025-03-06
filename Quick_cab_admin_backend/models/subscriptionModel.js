const pool = require('../config/db');

const Subscription = {
  // Create a new subscription
  async create(data) {
    const { duration, price } = data;
    
    if (!duration || !price) {
      throw new Error('Duration and price are required.');
    }
    
    const query = 'INSERT INTO subscriptions (duration, price) VALUES (?, ?)';
    const [result] = await pool.execute(query, [duration, price]);
    return result;
  },

  // Update an existing subscription by ID
  async update(id, data) {
    const { duration, price } = data;
    
    const query = 'UPDATE subscriptions SET duration = ?, price = ?, updatedAt = NOW() WHERE id = ?';
    const [result] = await pool.execute(query, [duration, price, id]);
    
    if (result.affectedRows === 0) {
      throw new Error('Subscription not found.');
    }
    
    return result;
  },

  // Delete a subscription by ID
  async delete(id) {
    const query = 'DELETE FROM subscriptions WHERE id = ?';
    const [result] = await pool.execute(query, [id]);
    
    if (result.affectedRows === 0) {
      throw new Error('Subscription not found.');
    }
    
    return result;
  },

  // Find a subscription by a specific column
  async findByColumn(columnName, value) {
    if (!columnName || !value) {
      throw new Error('Both column and value are required.');
    }
    
    // For dynamic column names, we need to use mysql2's format function
    // to avoid SQL injection
    const formattedQuery = `SELECT * FROM subscriptions WHERE ${columnName} LIKE ?`;
    const [rows] = await pool.execute(formattedQuery, [`%${value}%`]);
    return rows;
  },

  // Find all subscriptions with pagination
  async findAll(page, limit) {
    // Ensure page and limit are integers
    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 10;
    
    if (page <= 0 || limit <= 0) {
      throw new Error('Invalid page or limit parameters.');
    }
    
    // Calculate the offset for pagination
    const offset = (page - 1) * limit;
    
    // First get total count for pagination info
    const [countResult] = await pool.execute('SELECT COUNT(*) as total FROM subscriptions');
    const totalItems = countResult[0].total;
    const totalPages = Math.ceil(totalItems / limit);
    
    // Then get the actual data with LIMIT
    const [rows] = await pool.execute('SELECT * FROM subscriptions LIMIT ?, ?', [offset, limit]);
    
    return {
      data: rows,
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        pageSize: limit
      }
    };
  },
  
  // Get a specific subscription by ID
  async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM subscriptions WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      throw new Error('Subscription not found.');
    }
    
    return rows[0];
  }
};

module.exports = Subscription;