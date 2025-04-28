const express = require('express');
const router = express.Router();
const pricingRuleController = require('../../controllers/menuTemplates/pricingRuleController');

const verifyRestaurantToken = require('../../middleware/verifyRestaurantUsersToken');

// Crear nueva regla de precios
router.post('/', verifyRestaurantToken, pricingRuleController.create);

// Actualizar regla de precios
router.patch('/:id', verifyRestaurantToken, pricingRuleController.update);

// Obtener una regla de precios por ID
router.get('/:id', verifyRestaurantToken, pricingRuleController.getById);

// Obtener todas las reglas de precios (por filtros opcionales)
router.post('/get', verifyRestaurantToken, pricingRuleController.getAll);

module.exports = router;