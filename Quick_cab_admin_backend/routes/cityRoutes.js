const express = require("express");
const router = express.Router();
const cityController = require("../controllers/cityController");

/**
 * @swagger
 * tags:
 *   name: Cities
 *   description: API for managing cities
 */

/**
 * @swagger
 * /api/cities:
 *   get:
 *     summary: Retrieve all cities with optional search & pagination
 *     tags: [Cities]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Filter cities by name
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination (default is 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of records per page (default is 10)
 *     responses:
 *       200:
 *         description: Successfully retrieved list of cities
 *       500:
 *         description: Server error while fetching cities
 */
router.get("/", cityController.getAllCities);

/**
 * @swagger
 * /api/cities/{city_id}:
 *   get:
 *     summary: Retrieve city details by ID
 *     tags: [Cities]
 *     parameters:
 *       - in: path
 *         name: city_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique ID of the city
 *     responses:
 *       200:
 *         description: Successfully retrieved city details
 *       400:
 *         description: Invalid city ID provided
 *       404:
 *         description: City not found
 *       500:
 *         description: Server error while fetching city details
 */
router.get("/:city_id", cityController.getCityById);

/**
 * @swagger
 * /api/cities:
 *   post:
 *     summary: Add a new city
 *     tags: [Cities]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [city_name, state_name]
 *             properties:
 *               city_name:
 *                 type: string
 *                 example: "Pune"
 *               state_name:
 *                 type: string
 *                 example: "Maharashtra"
 *     responses:
 *       201:
 *         description: City added successfully
 *       400:
 *         description: Missing required fields (city_name, state_name)
 *       500:
 *         description: Server error while adding city
 */
router.post("/", cityController.addCity);

/**
 * @swagger
 * /api/cities/{city_id}:
 *   put:
 *     summary: Update city details
 *     tags: [Cities]
 *     parameters:
 *       - in: path
 *         name: city_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique ID of the city to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [city_name, state_name]
 *             properties:
 *               city_name:
 *                 type: string
 *                 example: "New Delhi"
 *               state_name:
 *                 type: string
 *                 example: "Delhi"
 *     responses:
 *       200:
 *         description: City updated successfully
 *       400:
 *         description: Missing required fields (city_name, state_name)
 *       404:
 *         description: City not found
 *       500:
 *         description: Server error while updating city
 */
router.put("/:city_id", cityController.updateCity);

/**
 * @swagger
 * /api/cities/{city_id}:
 *   delete:
 *     summary: Delete a city by ID
 *     tags: [Cities]
 *     parameters:
 *       - in: path
 *         name: city_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique ID of the city to delete
 *     responses:
 *       200:
 *         description: City deleted successfully
 *       400:
 *         description: Invalid city ID provided
 *       404:
 *         description: City not found
 *       500:
 *         description: Server error while deleting city
 */
router.delete("/:city_id", cityController.deleteCity);

module.exports = router;
