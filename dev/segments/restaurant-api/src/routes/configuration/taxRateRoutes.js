const express = require('express');
const router = express.Router();
const taxRateController = require('../../controllers/configuration/taxRateController');
const verifyRestaurantToken = require('../../middleware/verifyRestaurantUsersToken');
// GET: Obtener todos los impuestos de un negocio

console.log('GS - sTaxRateController', taxRateController);

router.get('/:id', verifyRestaurantToken, taxRateController.getById);

// POST: Crear nuevo impuesto
router.post('/', verifyRestaurantToken, taxRateController.create);

// POST: Get impuestos
router.post('/get', verifyRestaurantToken, taxRateController.getTaxRates);


// PATCH: Actualizar impuesto
router.patch('/:id',verifyRestaurantToken, taxRateController.update);

// DELETE: Borrar impuesto
//router.delete('/:id', verifyRestaurantToken, taxRateController.remove);

module.exports = router;