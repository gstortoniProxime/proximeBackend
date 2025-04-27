const express = require('express');
const router = express.Router();
const controller = require('../../controllers/attributes/attributeController');
const verifyRestaurantToken = require('../../middleware/verifyRestaurantUsersToken');

router.post('/', verifyRestaurantToken, controller.createAttribute);
router.get('/:id', verifyRestaurantToken, controller.getAttributeById);
router.post('/get', verifyRestaurantToken, controller.getAttributes);
router.patch('/:id', verifyRestaurantToken, controller.updateAttribute);
module.exports = router;