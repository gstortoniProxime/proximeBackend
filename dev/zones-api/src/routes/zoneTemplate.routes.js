const express = require('express');
const router = express.Router();
const controller = require('../controllers/zoneTemplate.controller');


/**
 * @swagger
 * /zone-templates:
 *   post:
 *     summary: Create a new zone template
 *     tags: [ZoneTemplates]
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
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [area, table, seat, custom]
 *               attributes:
 *                 type: object
 *               parentTemplate:
 *                 type: string
 *     responses:
 *       201:
 *         description: Template created
 */
router.post('/', controller.createTemplate);

/**
 * @swagger
 * /zone-templates:
 *   get:
 *     summary: Get all root templates
 *     tags: [ZoneTemplates]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of templates
 */
router.get('/', controller.getAllTemplates);

/**
 * @swagger
 * /zone-templates/{id}:
 *   get:
 *     summary: Get a template by ID
 *     tags: [ZoneTemplates]
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
 *         description: Template found
 */
router.get('/:id', controller.getTemplate);

/**
 * @swagger
 * /zone-templates/{id}:
 *   put:
 *     summary: Update a template by ID
 *     tags: [ZoneTemplates]
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
 *         description: Template updated
 */
router.put('/:id', controller.updateTemplate);

/**
 * @swagger
 * /zone-templates/{id}:
 *   delete:
 *     summary: Delete a template by ID
 *     tags: [ZoneTemplates]
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
 *         description: Template deleted
 */

router.delete('/:id', controller.deleteTemplate);

/**
 * @swagger
 * /zone-templates/clone:
 *   post:
 *     summary: Clone template into a branch
 *     tags: [ZoneTemplates]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - templateId
 *               - branchId
 *               - businessId
 *             properties:
 *               templateId:
 *                 type: string
 *               branchId:
 *                 type: string
 *               businessId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Zones created from template
 */
router.post('/clone', controller.cloneFromTemplate);

module.exports = router;
