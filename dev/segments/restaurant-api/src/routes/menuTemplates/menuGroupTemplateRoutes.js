const express = require('express');
const router = express.Router();
const menuGroupTemplateController = require('../../controllers/menuTemplates/menuGroupTemplateController');
const verifyRestaurantToken = require('../../middleware/verifyRestaurantUsersToken');

router.get('/subgroups/:parentId', verifyRestaurantToken, menuGroupTemplateController.getSubgroups);
router.get('/hierarchy', verifyRestaurantToken, menuGroupTemplateController.getHierarchy);
// POST: Crear nuevo MenuGroupTemplate
router.post('/', verifyRestaurantToken, menuGroupTemplateController.create);

// PATCH: Actualizar un MenuGroupTemplate
router.patch('/:id', verifyRestaurantToken, menuGroupTemplateController.update);

// GET: Obtener un MenuGroupTemplate por ID
router.get('/:id', verifyRestaurantToken, menuGroupTemplateController.getById);

// POST: Buscar MenuGroupTemplates
router.post('/get', verifyRestaurantToken, menuGroupTemplateController.getAll);





module.exports = router;