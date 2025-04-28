const express = require('express');
const router = express.Router();
const menuGroupTemplateController = require('../../controllers/menuTemplates/menuGroupTemplateController');
const verifyRestaurantToken = require('../../middleware/verifyRestaurantUsersToken');

// POST: Crear nuevo MenuGroupTemplate
router.post('/', verifyRestaurantToken, menuGroupTemplateController.create);

// PATCH: Actualizar un MenuGroupTemplate
router.patch('/:id', verifyRestaurantToken, menuGroupTemplateController.update);

// GET: Obtener un MenuGroupTemplate por ID
router.get('/:id', verifyRestaurantToken, menuGroupTemplateController.getById);

// POST: Buscar MenuGroupTemplates
router.post('/get', verifyRestaurantToken, menuGroupTemplateController.getAll);

module.exports = router;