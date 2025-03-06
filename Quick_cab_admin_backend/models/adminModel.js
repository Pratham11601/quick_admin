const db = require("../config/db");

class Admin {
  // Find admin by email
  static async findByEmail(email) {
    const [rows] = await db.execute("SELECT * FROM admin WHERE email = ?", [email]);
    return rows[0];
  }

  // Find admin by ID
  static async findById(id) {
    const [rows] = await db.execute("SELECT * FROM admin WHERE id = ?", [id]);
    return rows[0];
  }

  // Update password for admin
  static async updatePassword(id, newPassword) {
    const [result] = await db.execute("UPDATE admin SET password = ? WHERE id = ?", [newPassword, id]);
    return result;
  }

  // Update reset token for admin
  static async updateResetToken(id, resetToken) {
    const [result] = await db.execute("UPDATE admin SET resetToken = ? WHERE id = ?", [resetToken, id]);
    return result;
  }

  // Verify and find admin by reset token
  static async findByResetToken(resetToken) {
    const [rows] = await db.execute("SELECT * FROM admin WHERE resetToken = ?", [resetToken]);
    return rows[0];
  }

  // Invalidate the session or token (for logout functionality)
  static async invalidateSession(id) {
    // Example: Removing the reset token or adding a logout flag
    const [result] = await db.execute("UPDATE admin SET resetToken = NULL WHERE id = ?", [id]);
    return result;
  }
}

module.exports = Admin;
