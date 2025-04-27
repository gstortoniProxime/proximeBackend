// dev/segments/restaurant-api/src/routes/configuration/sizeTemplateRoutes.js

const express = require('express');
const router = express.Router();

const sizeTemplateController = require('../../controllers/configuration/sizeTemplateController');
const verifyRestaurantToken = require('../../middleware/verifyRestaurantUsersToken');

// Crear nuevo tamaño
router.post('/', verifyRestaurantToken, sizeTemplateController.create);

// Actualizar un tamaño
router.patch('/:id', verifyRestaurantToken, sizeTemplateController.update);

// Obtener todos los tamaños del negocio
router.post('/get', verifyRestaurantToken, sizeTemplateController.getAll);

// Obtener un tamaño por ID
router.get('/:id', verifyRestaurantToken, sizeTemplateController.getById);

module.exports = router;