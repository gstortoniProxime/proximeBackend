const express = require('express');
const router = express.Router();
const menuTemplateController = require('../../controllers/menuTemplates/menuTemplateController');

const verifyRestaurantToken = require('../../middleware/verifyRestaurantUsersToken');

// POST: Crear nuevo MenuTemplate
router.post('/', verifyRestaurantToken, menuTemplateController.create);

// PATCH: Actualizar MenuTemplate
router.patch('/:id', verifyRestaurantToken, menuTemplateController.update);

// GET: Obtener MenuTemplate por ID
router.get('/:id', verifyRestaurantToken, menuTemplateController.getById);

// POST: Obtener múltiples MenuTemplates por filtros
router.post('/get', verifyRestaurantToken, menuTemplateController.getMenuTemplates);

module.exports = router;