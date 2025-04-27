const express = require('express');
const router = express.Router();
const allergenController = require('../../controllers/configuration/allergenController');
const verifyRestaurantToken = require('../../middleware/verifyRestaurantUsersToken'); // ⚡ Seguridad Proxime

// Crear nuevo alérgeno
router.post('/', verifyRestaurantToken, allergenController.createAllergen);

// Obtener todos los alérgenos
router.post('/get', verifyRestaurantToken, allergenController.getAllergens);

// Obtener un alérgeno por ID
router.get('/:id', verifyRestaurantToken, allergenController.getAllergenById);

// Actualizar un alérgeno
router.patch('/:id', verifyRestaurantToken, allergenController.updateAllergen);

// Eliminar (soft delete) un alérgeno
router.delete('/:id', verifyRestaurantToken, allergenController.deleteAllergen);

module.exports = router;