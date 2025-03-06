const express = require("express");
const router = express.Router();
const helpSupportController = require("../controllers/helpSupportController");

/**
 * @swagger
 * tags:
 *   name: Help Support
 *   description: Help and support ticket management
 */

/**
 * @swagger
 * /api/help-support:
 *   get:
 *     summary: Get all help support queries with pagination and search
 *     tags: [Help Support]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by query message, vendor category, name, or contact
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of results per page
 *     responses:
 *       200:
 *         description: Help support queries retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Help support queries retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/HelpSupport'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     totalItems:
 *                       type: integer
 *                       example: 45
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     pageSize:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *       404:
 *         description: No queries found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/", helpSupportController.getAllHelpSupport);

/**
 * @swagger
 * /api/help-support/{id}:
 *   get:
 *     summary: Get a specific help support query by ID
 *     tags: [Help Support]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The help support query ID
 *     responses:
 *       200:
 *         description: Query retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Query retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/HelpSupport'
 *       404:
 *         description: Query not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:id", helpSupportController.getHelpSupportById);

/**
 * @swagger
 * /api/help-support:
 *   post:
 *     summary: Add a new help support query
 *     tags: [Help Support]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - query_message
 *               - vendor_category
 *               - vendor_id
 *               - vendor_contact
 *               - vendor_name
 *             properties:
 *               query_message:
 *                 type: string
 *                 example: "Cannot upload profile image"
 *               vendor_category:
 *                 type: string
 *                 example: "Cab"
 *               vendor_id:
 *                 type: integer
 *                 example: 362
 *               vendor_contact:
 *                 type: string
 *                 example: "9890218723"
 *               vendor_name:
 *                 type: string
 *                 example: "Jitendra Babar"
 *               remark:
 *                 type: string
 *                 example: "Issue resolved"
 *               remark_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-02-26"
 *     responses:
 *       201:
 *         description: Query added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Help support query added successfully"
 *                 data:
 *                   $ref: '#/components/schemas/HelpSupport'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/", helpSupportController.addHelpSupport);

/**
 * @swagger
 * /api/help-support/{id}:
 *   put:
 *     summary: Update an existing help support query
 *     tags: [Help Support]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The help support query ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               query_message:
 *                 type: string
 *                 example: "Cannot upload profile image"
 *               vendor_category:
 *                 type: string
 *                 example: "Cab"
 *               vendor_id:
 *                 type: integer
 *                 example: 362
 *               vendor_contact:
 *                 type: string
 *                 example: "9890218723"
 *               vendor_name:
 *                 type: string
 *                 example: "Jitendra Babar"
 *               remark:
 *                 type: string
 *                 example: "Fixed by updating storage permissions"
 *               remark_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-02-26"
 *     responses:
 *       200:
 *         description: Query updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Help support query updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/HelpSupport'
 *       404:
 *         description: Query not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put("/:id", helpSupportController.updateHelpSupport);

/**
 * @swagger
 * /api/help-support/{id}:
 *   delete:
 *     summary: Delete a help support query
 *     tags: [Help Support]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The help support query ID
 *     responses:
 *       200:
 *         description: Query deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Help support query deleted successfully"
 *       404:
 *         description: Query not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete("/:id", helpSupportController.deleteHelpSupport);

module.exports = router;