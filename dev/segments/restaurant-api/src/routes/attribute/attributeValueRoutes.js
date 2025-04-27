const express = require('express');
const router = express.Router();
const controller = require('../../controllers/attributes/attributeValueController');
const verifyRestaurantToken = require('../../middleware/verifyRestaurantUsersToken');


router.post('/', verifyRestaurantToken, controller.createAttributeValue);
router.get('/:id', verifyRestaurantToken, controller.getAttributeValuesById);
router.patch('/:attributeId', verifyRestaurantToken, controller.updateAttributeValuesByAttributeId);

module.exports = router;