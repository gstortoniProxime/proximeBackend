const ZoneTemplate = require('../models/zoneTemplate.model');
const { cloneTemplateRecursive } = require('../services/zoneTemplate.service');

exports.createTemplate = async (req, res) => {
  try {
    const template = await ZoneTemplate.create(req.body);
    if (template.parentTemplate) {
      await ZoneTemplate.findByIdAndUpdate(template.parentTemplate, {
        $push: { children: template._id }
      });
    }
    res.status(201).json(template);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTemplate = async (req, res) => {
  try {
    const template = await ZoneTemplate.findById(req.params.id).populate('children');
    if (!template) return res.status(404).json({ error: 'Template not found' });
    res.json(template);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllTemplates = async (req, res) => {
  try {
    const templates = await ZoneTemplate.find({ parentTemplate: null });
    res.json(templates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTemplate = async (req, res) => {
  try {
    const template = await ZoneTemplate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(template);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTemplate = async (req, res) => {
  try {
    const template = await ZoneTemplate.findByIdAndDelete(req.params.id);
    if (!template) return res.status(404).json({ error: 'Template not found' });

    if (template.parentTemplate) {
      await ZoneTemplate.findByIdAndUpdate(template.parentTemplate, {
        $pull: { children: template._id }
      });
    }

    res.json({ message: 'Template deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.cloneFromTemplate = async (req, res) => {
  const { templateId, branchId, businessId } = req.body;

  if (!templateId || !branchId || !businessId) {
    return res.status(400).json({ error: 'templateId, branchId and businessId are required' });
  }

  try {
    const rootZone = await cloneTemplateRecursive(templateId, branchId, businessId);
    res.status(201).json({ message: 'Zones created from template', rootZone });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
