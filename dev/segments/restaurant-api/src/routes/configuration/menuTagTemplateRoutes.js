const express = require('express');
const router = express.Router();

const menuTagTemplateController = require('../../controllers/configuration/menuTagTemplateController');
const verifyRestaurantToken = require('../../middleware/verifyRestaurantUsersToken');

// POST - Crear nuevo tag
router.post('/', verifyRestaurantToken, menuTagTemplateController.create);

// PATCH - Actualizar tag
router.patch('/:id', verifyRestaurantToken, menuTagTemplateController.update);

// GET - Obtener tag por ID
router.get('/:id', verifyRestaurantToken, menuTagTemplateController.getById);

// POST - Buscar tags filtrados
router.post('/get', verifyRestaurantToken, menuTagTemplateController.getTags);

module.exports = router;