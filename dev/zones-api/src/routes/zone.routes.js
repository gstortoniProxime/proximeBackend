const express = require('express');
const router = express.Router();
const controller = require('../controllers/zone.controller');

/**
 * @swagger
 * /zones:
 *   post:
 *     summary: Create a new zone
 *     tags: [Zones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *               - branchId
 *               - businessId
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [area, table, seat, custom]
 *               attributes:
 *                 type: object
 *               branchId:
 *                 type: string
 *               businessId:
 *                 type: string
 *               parentZone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Zone created
 */

router.post('/', controller.createZone);

/**
 * @swagger
 * /zones/{id}:
 *   get:
 *     summary: Get a zone by ID
 *     tags: [Zones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Zone found
 */
router.get('/:id', controller.getZone);

/**
 * @swagger
 * /zones:
 *   get:
 *     summary: Get all zones by branch ID
 *     tags: [Zones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: branchId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: List of zones
 */
router.get('/', controller.getZonesByBranch);

/**
 * @swagger
 * /zones/{id}:
 *   put:
 *     summary: Update a zone by ID
 *     tags: [Zones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Zone updated
 */

router.put('/:id', controller.updateZone);

/**
 * @swagger
 * /zones/{id}:
 *   delete:
 *     summary: Delete a zone by ID
 *     tags: [Zones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Zone deleted
 */

router.delete('/:id', controller.deleteZone);

module.exports = router;
