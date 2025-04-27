const express = require('express');
const router = express.Router();
const menuTypeTemplateController = require('../../controllers/menuTemplates/menuTypeTemplateController');
const verifyRestaurantToken = require('../../middleware/verifyRestaurantUsersToken');

// Crear un nuevo tipo de menú
router.post('/', verifyRestaurantToken, menuTypeTemplateController.create);

// Actualizar un tipo de menú existente
router.patch('/:id', verifyRestaurantToken, menuTypeTemplateController.update);

// Obtener un tipo de menú por ID
router.get('/:id', verifyRestaurantToken, menuTypeTemplateController.getById);

// Listar todos los tipos de menú con filtros
router.post('/get', verifyRestaurantToken, menuTypeTemplateController.getMenuTypes);

module.exports = router;