const express = require('express');
const router = express.Router();
const businessController = require('../controllers/businessController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, businessController.createBusiness);
router.get('/', businessController.getBusinesses);

module.exports = router;
