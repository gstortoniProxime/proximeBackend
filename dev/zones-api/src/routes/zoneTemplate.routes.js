const express = require('express');
const router = express.Router();
const controller = require('../controllers/zoneTemplate.controller');

// CRUD básico
router.post('/', controller.createTemplate);
router.get('/', controller.getAllTemplates);
router.get('/:id', controller.getTemplate);
router.put('/:id', controller.updateTemplate);
router.delete('/:id', controller.deleteTemplate);

// Clonación desde template
router.post('/clone', controller.cloneFromTemplate);

module.exports = router;
