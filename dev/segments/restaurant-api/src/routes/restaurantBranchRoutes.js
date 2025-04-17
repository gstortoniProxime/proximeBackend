const express = require('express');
const router = express.Router();
const controller = require('../controllers/restaurantBranchController');

router.post('/', controller.createBranch);
router.get('/', controller.getBranches);

module.exports = router;
