const express = require('express');
const router = express.Router();
const controller = require('../controllers/restaurantBusinessController');
const authenticate = require('../middlewares/authenticate');

// Todas las rutas protegidas con autenticación
router.post('/', authenticate, controller.createBusiness);
router.get('/', authenticate, controller.getBusinesses);

module.exports = router;