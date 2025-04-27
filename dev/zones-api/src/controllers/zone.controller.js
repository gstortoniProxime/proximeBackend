const zoneService = require('../services/zone.service');

// POST /zones
exports.createZone = async (req, res) => {
  try {
    const zone = await zoneService.createZone(req.body);
    res.status(201).json(zone);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /zones/:id
exports.getZone = async (req, res) => {
  try {
    const zone = await zoneService.getZoneById(req.params.id);
    if (!zone) return res.status(404).json({ error: 'Zone not found' });
    res.json(zone);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /zones?branchId=xxx
exports.getZonesByBranch = async (req, res) => {
  try {
    const zones = await zoneService.getZonesByBranch(req.query.branchId);
    res.json(zones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /zones/:id
exports.updateZone = async (req, res) => {
  try {
    const updatedZone = await zoneService.updateZone(req.params.id, req.body);
    res.json(updatedZone);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /zones/:id
exports.deleteZone = async (req, res) => {
  try {
    const deleted = await zoneService.deleteZone(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Zone not found' });
    res.json({ message: 'Zone deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
