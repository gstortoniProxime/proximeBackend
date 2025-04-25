const express = require('express');
const router = express.Router();
const salesCategoryTemplateController = require('../../controllers/configuration/salesCategoryTemplateController');

const verifyRestaurantToken = require('../../middleware/verifyRestaurantUsersToken');

// POST - Crear nueva categoría de ventas
router.post('/', verifyRestaurantToken, salesCategoryTemplateController.createSalesCategory);

// PATCH - Actualizar categoría de ventas
router.patch('/:id', verifyRestaurantToken, salesCategoryTemplateController.updateSalesCategory);

// GET - Obtener una categoría de ventas por ID
router.get('/:id', verifyRestaurantToken, salesCategoryTemplateController.getSalesCategoryById);

// POST - Obtener todas las categorías de ventas por filtros
router.post('/get', verifyRestaurantToken, salesCategoryTemplateController.getSalesCategories);

// PATCH - Soft delete de categoría de ventas
router.delete('/:id', verifyRestaurantToken, salesCategoryTemplateController.deleteSalesCategory);

module.exports = router;