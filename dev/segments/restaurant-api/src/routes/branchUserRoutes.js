const express = require('express');
const router = express.Router();
const controller = require('../controllers/branchUserController');

router.post('/', controller.createBranchUser);
router.get('/branch/:branchId', controller.getUsersByBranch);

module.exports = router;