const mysql = require("mysql2/promise"); // Use mysql2's promise-based API
const dotenv = require("dotenv");

dotenv.config();

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "quick_cab",
  waitForConnections: true,
  connectionLimit: 10, // Max concurrent connections
  queueLimit: 0, // No limit for queued connections
});

// Test database connection
// Test database connection

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Database connected successfully!");
    connection.release(); // Release connection back to the pool
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1); // Exit process if the database connection fails
  }
})();

// Handle pool errors globally
pool.on("error", (err) => {
  console.error("🔥 MySQL Pool Error:", err.message);
  process.exit(1); // Exit process to avoid unexpected behavior
});

module.exports = pool;
