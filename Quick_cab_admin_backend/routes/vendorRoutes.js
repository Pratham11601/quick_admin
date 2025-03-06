const express = require("express");
const {
  getAllVendors,
  getVendorsWithPagination,
  getVendorById,
  addVendor,
  deleteVendor,
  updateVendor,
  searchVendor,
} = require("../controllers/vendorController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Vendor
 *   description: Vendor management APIs for MySQL
 */

/**
 * @swagger
 * /api/vendor:
 *   get:
 *     summary: Retrieve all vendors
 *     tags: [Vendor]
 *     responses:
 *       200:
 *         description: Successfully retrieved all vendors.
 *       500:
 *         description: Server error.
 */
router.get("/", getAllVendors);

/**
 * @swagger
 * /api/vendor/paginated:
 *   get:
 *     summary: Get vendors with pagination
 *     tags: [Vendor]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (default is 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of records per page (default is 10)
 *     responses:
 *       200:
 *         description: Successfully retrieved paginated vendors.
 *       500:
 *         description: Server error.
 */
router.get("/paginated", getVendorsWithPagination);

/**
 * @swagger
 * /api/vendor/search:
 *   get:
 *     summary: Search vendors by name, email, phone, or business name
 *     tags: [Vendor]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: Search term (e.g., vendor name, email, phone, business name)
 *     responses:
 *       200:
 *         description: Successfully retrieved matching vendors.
 *       400:
 *         description: Missing search query.
 *       404:
 *         description: No vendors found.
 *       500:
 *         description: Server error.
 */
router.get("/search", searchVendor);

/**
 * @swagger
 * /api/vendor/{id}:
 *   get:
 *     summary: Retrieve a vendor by ID
 *     tags: [Vendor]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Vendor ID (Primary Key in MySQL)
 *     responses:
 *       200:
 *         description: Vendor found.
 *       404:
 *         description: Vendor not found.
 *       500:
 *         description: Server error.
 */
router.get("/:id", getVendorById);

/**
 * @swagger
 * /api/vendor:
 *   post:
 *     summary: Add a new vendor
 *     tags: [Vendor]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - business_name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Vendor's full name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Vendor's email address
 *               phone:
 *                 type: string
 *                 description: Vendor's phone number
 *               business_name:
 *                 type: string
 *                 description: Vendor's business name
 *     responses:
 *       201:
 *         description: Vendor added successfully.
 *       400:
 *         description: Missing required fields.
 *       500:
 *         description: Server error.
 */
router.post("/", addVendor);

/**
 * @swagger
 * /api/vendor/{id}:
 *   put:
 *     summary: Update vendor details
 *     tags: [Vendor]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Vendor ID (Primary Key in MySQL)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Vendor's updated name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Vendor's updated email
 *               phone:
 *                 type: string
 *                 description: Vendor's updated phone number
 *               business_name:
 *                 type: string
 *                 description: Vendor's updated business name
 *     responses:
 *       200:
 *         description: Vendor details updated successfully.
 *       400:
 *         description: Invalid request or missing fields.
 *       404:
 *         description: Vendor not found.
 *       500:
 *         description: Server error.
 */
router.put("/:id", updateVendor);

/**
 * @swagger
 * /api/vendor/{id}:
 *   delete:
 *     summary: Delete a vendor
 *     tags: [Vendor]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Vendor ID (Primary Key in MySQL)
 *     responses:
 *       200:
 *         description: Vendor deleted successfully.
 *       404:
 *         description: Vendor not found.
 *       500:
 *         description: Server error.
 */
router.delete("/:id", deleteVendor);

module.exports = router;
