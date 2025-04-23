const express = require('express');
const router = express.Router();
const controller = require('../controllers/zone.controller');

// /zones
router.post('/', controller.createZone);
router.get('/:id', controller.getZone);
router.get('/', controller.getZonesByBranch);
router.put('/:id', controller.updateZone);
router.delete('/:id', controller.deleteZone);

module.exports = router;
