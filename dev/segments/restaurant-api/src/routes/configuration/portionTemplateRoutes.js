const express = require('express');
const router = express.Router();
const portionTemplateController = require('../../controllers/configuration/portionTemplateController');

const verifyRestaurantToken = require('../../middleware/verifyRestaurantUsersToken');

// POST: Crear una nueva porción
router.post('/', verifyRestaurantToken, portionTemplateController.create);

// PATCH: Actualizar una porción existente
router.patch('/:id', verifyRestaurantToken, portionTemplateController.update);

// GET: Obtener una porción por ID
router.get('/:id', verifyRestaurantToken, portionTemplateController.getById);

// POST: Obtener todas las porciones (con filtros)
router.post('/get', verifyRestaurantToken, portionTemplateController.getAll);

module.exports = router;