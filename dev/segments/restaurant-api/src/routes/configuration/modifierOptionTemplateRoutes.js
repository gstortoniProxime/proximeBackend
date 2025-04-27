const express = require('express');
const router = express.Router();

const modifierOptionTemplateController = require('../../controllers/configuration/modifierOptionTemplateController');
const verifyRestaurantToken = require('../../middleware/verifyRestaurantUsersToken');

// POST: Crear nuevo ModifierOptionTemplate
router.post('/', verifyRestaurantToken, modifierOptionTemplateController.create);

// PATCH: Actualizar ModifierOptionTemplate
router.patch('/:id', verifyRestaurantToken, modifierOptionTemplateController.update);

// GET: Obtener ModifierOptionTemplate por ID
router.get('/:id', verifyRestaurantToken, modifierOptionTemplateController.getById);

// POST: Obtener lista filtrada de ModifierOptionTemplates
router.post('/get', verifyRestaurantToken, modifierOptionTemplateController.getAll);

module.exports = router;