const ZoneTemplate = require('../models/zoneTemplate.model');
const Zone = require('../models/zone.model');

async function cloneTemplateRecursive(templateId, branchId, businessId, parentZone = null) {
  const template = await ZoneTemplate.findById(templateId).lean();
  if (!template) throw new Error(`Template ID ${templateId} not found`);

  const newZone = await Zone.create({
    name: template.name,
    type: template.type,
    attributes: template.attributes,
    branchId,
    businessId,
    parentZone,
    children: []
  });

  for (const childTemplateId of template.children) {
    const child = await cloneTemplateRecursive(childTemplateId, branchId, businessId, newZone._id);
    await Zone.findByIdAndUpdate(newZone._id, { $push: { children: child._id } });
  }

  return newZone;
}

module.exports = {
  cloneTemplateRecursive
};
