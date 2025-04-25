const express = require('express');
const router = express.Router();
const controller = require('../controllers/restaurantBranchController');
const verifyRestaurantToken = require('../middleware/verifyRestaurantUsersToken');
router.post('/', verifyRestaurantToken, controller.createBranch);
router.post('/getbranches', verifyRestaurantToken, controller.getBranches);
router.get('/:id', verifyRestaurantToken, controller.getBranchById);
router.patch('/:id', verifyRestaurantToken, controller.updateBranch);
module.exports = router;
