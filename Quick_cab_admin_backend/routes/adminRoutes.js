const express = require("express");
const { adminLogin, forgotPassword, resetPassword, changePassword, logout } = require("../controllers/adminController");

const router = express.Router();

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Admin Login
 *     description: Logs in an admin and returns a JWT token.
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "quickcab@gmail.com"
 *               password:
 *                 type: string
 *                 example: "12345678"
 *     responses:
 *       200:
 *         description: Login successful.
 *       400:
 *         description: Bad request, missing fields.
 *       401:
 *         description: Unauthorized, incorrect credentials.
 */
router.post("/login", adminLogin);

/**
 * @swagger
 * /api/admin/logout:
 *   post:
 *     summary: Admin Logout
 *     description: Logs out an admin by invalidating the session token (client side).
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Logout successful.
 */
router.post("/logout", logout);

/**
 * @swagger
 * /api/admin/forgot-password:
 *   post:
 *     summary: Forgot Password
 *     description: Sends a password reset link to the email.
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "quickcab@gmail.com"
 *     responses:
 *       200:
 *         description: Password reset link sent.
 *       400:
 *         description: Bad request, missing email.
 *       404:
 *         description: Admin not found.
 */
router.post("/forgot-password", forgotPassword);

/**
 * @swagger
 * /api/admin/reset-password:
 *   post:
 *     summary: Reset Password
 *     description: Resets the admin password using a reset token.
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 example: "abcdef12345"
 *               newPassword:
 *                 type: string
 *                 example: "newpassword123"
 *     responses:
 *       200:
 *         description: Password reset successfully.
 *       400:
 *         description: Invalid or expired token.
 */
router.post("/reset-password", resetPassword);

/**
 * @swagger
 * /api/admin/change-password:
 *   post:
 *     summary: Change Password
 *     description: Changes the admin password.
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               adminId:
 *                 type: integer
 *                 example: 1
 *               oldPassword:
 *                 type: string
 *                 example: "oldpassword123"
 *               newPassword:
 *                 type: string
 *                 example: "newpassword123"
 *     responses:
 *       200:
 *         description: Password changed successfully.
 *       400:
 *         description: Old password is incorrect.
 */
router.post("/change-password", changePassword);

module.exports = router;
