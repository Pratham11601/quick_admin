const express = require("express");
const {
  getAllSubPackages,
  getSubPackageById,
  searchSubPackage,
  addSubPackage,
  updateSubPackage,
  deleteSubPackage,
} = require("../controllers/subPackageController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: SubPackages
 *   description: API endpoints for managing sub-packages
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SubPackage:
 *       type: object
 *       required:
 *         - package_name
 *         - duration_in_days
 *         - price_per_day
 *         - total_price
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated ID of the sub-package
 *           example: 1
 *         package_name:
 *           type: string
 *           description: The name of the package
 *           example: "Premium Plan"
 *         duration_in_days:
 *           type: integer
 *           description: Duration of the package in days
 *           example: 30
 *         price_per_day:
 *           type: integer
 *           description: Price per day for the package
 *           example: 100
 *         total_price:
 *           type: integer
 *           description: Total price calculated as duration * price_per_day
 *           example: 3000
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *           example: "2025-02-25T10:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last updated timestamp
 *           example: "2025-02-25T12:00:00Z"
 */

/**
 * @swagger
 * /api/sub-packages:
 *   get:
 *     summary: Get all sub-packages with pagination
 *     tags: [SubPackages]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of records per page
 *     responses:
 *       200:
 *         description: Successfully retrieved sub-packages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 total:
 *                   type: integer
 *                   example: 50
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SubPackage'
 */
router.get("/", getAllSubPackages);

/**
 * @swagger
 * /api/sub-packages/search:
 *   get:
 *     summary: Search sub-packages by any column
 *     tags: [SubPackages]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Search term for package_name, price_per_day, or total_price
 *     responses:
 *       200:
 *         description: Successfully retrieved matching sub-packages
 *       404:
 *         description: No matching sub-packages found
 */
router.get("/search", searchSubPackage);

/**
 * @swagger
 * /api/sub-packages/{id}:
 *   get:
 *     summary: Get a sub-package by ID
 *     tags: [SubPackages]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the sub-package
 *     responses:
 *       200:
 *         description: Successfully retrieved sub-package
 *       404:
 *         description: Sub-package not found
 */
router.get("/:id", getSubPackageById);

/**
 * @swagger
 * /api/sub-packages:
 *   post:
 *     summary: Add a new sub-package
 *     tags: [SubPackages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubPackage'
 *     responses:
 *       201:
 *         description: Sub-package added successfully
 *       400:
 *         description: Invalid input, missing required fields
 */
router.post("/", addSubPackage);

/**
 * @swagger
 * /api/sub-packages/{id}:
 *   put:
 *     summary: Update a sub-package by ID
 *     tags: [SubPackages]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the sub-package to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubPackage'
 *     responses:
 *       200:
 *         description: Sub-package updated successfully
 *       404:
 *         description: Sub-package not found
 */
router.put("/:id", updateSubPackage);

/**
 * @swagger
 * /api/sub-packages/{id}:
 *   delete:
 *     summary: Delete a sub-package by ID
 *     tags: [SubPackages]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the sub-package to delete
 *     responses:
 *       200:
 *         description: Sub-package deleted successfully
 *       404:
 *         description: Sub-package not found
 */
router.delete("/:id", deleteSubPackage);

module.exports = router;
