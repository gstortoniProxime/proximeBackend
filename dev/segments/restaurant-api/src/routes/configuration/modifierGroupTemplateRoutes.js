const express = require('express');
const router = express.Router();
const modifierGroupTemplateController = require('../../controllers/configuration/modifierGroupTemplateController');

const verifyRestaurantToken = require('../../middleware/verifyRestaurantUsersToken');

// POST: Crear un nuevo grupo de modificadores
router.post('/', verifyRestaurantToken, modifierGroupTemplateController.create);

// PATCH: Actualizar un grupo de modificadores existente
router.patch('/:id', verifyRestaurantToken, modifierGroupTemplateController.update);

// GET: Obtener un grupo de modificadores por ID
router.get('/:id', verifyRestaurantToken, modifierGroupTemplateController.getById);

// POST: Obtener todos los grupos de modificadores (usando filtros opcionales)
router.post('/get', verifyRestaurantToken, modifierGroupTemplateController.getAll);

module.exports = router;