const express = require('express');
const router = express.Router();
const controller = require('../controllers/restaurantUserController');
const verifyCoreToken = require('../middleware/verifyCoreToken');

router.post('/', verifyCoreToken, controller.createUser);
router.post('/login', controller.loginUser);

module.exports = router;