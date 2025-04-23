const Zone = require('../models/zone.model');

// Crear zona individual
async function createZone(data) {
  const zone = await Zone.create(data);
  if (zone.parentZone) {
    await Zone.findByIdAndUpdate(zone.parentZone, { $push: { children: zone._id } });
  }
  return zone;
}

// Obtener zona por ID
async function getZoneById(id) {
  return Zone.findById(id).populate('children').lean();
}

// Obtener todas las zonas de un branch
async function getZonesByBranch(branchId) {
  return Zone.find({ branchId }).lean();
}

// Actualizar zona
async function updateZone(id, updates) {
  return Zone.findByIdAndUpdate(id, updates, { new: true });
}

// Eliminar zona
async function deleteZone(id) {
  const zone = await Zone.findById(id);
  if (!zone) return null;

  if (zone.parentZone) {
    await Zone.findByIdAndUpdate(zone.parentZone, { $pull: { children: id } });
  }

  return Zone.findByIdAndDelete(id);
}

module.exports = {
  createZone,
  getZoneById,
  getZonesByBranch,
  updateZone,
  deleteZone
};
