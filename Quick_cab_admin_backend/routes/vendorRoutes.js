const express = require("express");
const {
  getAllVendors,
  getVendorsWithPagination,
  getVendorById,
  addVendor,
  deleteVendor,
  updateVendor,
  searchVendor, // Ensure this is properly defined in the controller
} = require("../controllers/vendorController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Vendor
 *   description: Vendor management APIs
 */

/**
 * @swagger
 * /api/vendor:
 *   get:
 *     summary: Get all vendors
 *     tags: [Vendor]
 *     responses:
 *       200:
 *         description: Successfully retrieved all vendors.
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
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of records per page
 *     responses:
 *       200:
 *         description: Successfully retrieved paginated vendors.
 */
router.get("/paginated", getVendorsWithPagination);

/**
 * @swagger
 * /api/vendor/search:
 *   get:
 *     summary: Search vendors by any column
 *     tags: [Vendor]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: Search term (name, email, phone, business name, etc.)
 *     responses:
 *       200:
 *         description: Successfully retrieved matching vendors.
 */
router.get("/search", searchVendor);

/**
 * @swagger
 * /api/vendor/{id}:
 *   get:
 *     summary: Get vendor by ID
 *     tags: [Vendor]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Vendor ID
 *     responses:
 *       200:
 *         description: Vendor found.
 *       404:
 *         description: Vendor not found.
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
 *             $ref: '#/components/schemas/Vendor'
 *     responses:
 *       201:
 *         description: Vendor added successfully.
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
 *         description: Vendor ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Vendor'
 *     responses:
 *       200:
 *         description: Vendor details updated successfully.
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
 *         description: Vendor ID
 *     responses:
 *       200:
 *         description: Vendor deleted successfully.
 *       404:
 *         description: Vendor not found.
 */
router.delete("/:id", deleteVendor);

module.exports = router;
