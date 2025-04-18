//dev/segments/restaurant-api/src/routes/restaurantBusinessRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/restaurantBusinessController');
const authenticate = require('../middleware/authenticate');
const verifyCoreToken = require('../middleware/verifyAdminCoreToken');


// Todas las rutas protegidas con autenticación
router.post('/', verifyCoreToken, controller.createBusiness);
router.get('/', authenticate, controller.getBusinesses);
router.get('/:id', authenticate, controller.getBusinessesById);
module.exports = router;