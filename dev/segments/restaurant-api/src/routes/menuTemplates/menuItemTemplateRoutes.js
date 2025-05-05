const express = require('express');
const router = express.Router();
const menuItemTemplateController = require('../../controllers/menuTemplates/menuItemTemplateController');
const verifyRestaurantToken = require('../../middleware/verifyRestaurantUsersToken');


router.get('/menugroup/:groupId', verifyRestaurantToken, menuItemTemplateController.getByMenuGroup);


// Crear nuevo MenuItemTemplate
router.post('/', verifyRestaurantToken, menuItemTemplateController.create);

// Actualizar un MenuItemTemplate existente
router.patch('/:id', verifyRestaurantToken, menuItemTemplateController.update);

// Obtener un MenuItemTemplate por ID
router.get('/:id', verifyRestaurantToken, menuItemTemplateController.getById);

// Obtener lista de MenuItemTemplates filtrados
router.post('/get', verifyRestaurantToken, menuItemTemplateController.getAll);



module.exports = router;