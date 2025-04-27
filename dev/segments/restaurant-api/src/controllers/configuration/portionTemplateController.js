const PortionTemplate = require('../../models/PortionTemplate');
const utils = require('../../utils/utils');

// POST - Crear una nueva PortionTemplate
exports.create = async (req, res) => {
  try {
    const authBusinessId = req.authUser.businessId;
    const { value } = req.body;

    // Verificar si ya existe una Portion con el mismo "value" para este business
    const existingPortion = await PortionTemplate.findOne({
      businessId: authBusinessId,
      value: value.trim().toLowerCase()
    });

    if (existingPortion) {
      return res.status(400).json({
        error: `Portion "${value}" already exists for your business`
      });
    }

    const newPortion = new PortionTemplate({
      ...req.body,
      value: value.trim().toLowerCase(),
      businessId: authBusinessId
    });

    await newPortion.save();

    const { businessId, ...cleaned } = newPortion.toObject();
    res.status(201).json(cleaned);

  } catch (err) {
    console.error('💥 Error creating PortionTemplate:', err);
    res.status(400).json({ error: 'Error creating portion', details: err.message });
  }
};

// PATCH - Actualizar una PortionTemplate
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const authBusinessId = req.authUser.businessId;

    const existingPortion = await PortionTemplate.findOne({
      _id: id,
      businessId: authBusinessId
    });

    if (!existingPortion) {
      return res.status(404).json({ error: 'Portion not found for your business' });
    }

    const allowedFields = ['value', 'i18n', 'displayOrder', 'isActive'];

    // Si cambian el value, validamos duplicado
    if (req.body.value && req.body.value.trim().toLowerCase() !== existingPortion.value) {
      const duplicate = await PortionTemplate.findOne({
        businessId: authBusinessId,
        value: req.body.value.trim().toLowerCase(),
        _id: { $ne: id }
      });

      if (duplicate) {
        return res.status(400).json({
          error: `Another portion with value "${req.body.value}" already exists`
        });
      }

      existingPortion.value = req.body.value.trim().toLowerCase();
    }

    allowedFields.forEach(field => {
      if (field !== 'value' && req.body[field] !== undefined) {
        existingPortion[field] = req.body[field];
      }
    });

    await existingPortion.save();

    const { businessId, ...cleaned } = existingPortion.toObject({ flattenMaps: true });
    res.json(cleaned);

  } catch (err) {
    console.error('💥 Error updating PortionTemplate:', err);
    res.status(400).json({ error: 'Error updating portion', details: err.message });
  }
};

// GET - Obtener PortionTemplate por ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const authBusinessId = req.authUser.businessId;

    const portion = await PortionTemplate.findOne({
      _id: id,
      businessId: authBusinessId
    });

    if (!portion) {
      return res.status(404).json({ error: 'Portion not found for your business' });
    }

    const { businessId, ...cleaned } = portion.toObject({ flattenMaps: true });
    res.json(cleaned);

  } catch (err) {
    console.error('💥 Error retrieving PortionTemplate by ID:', err);
    res.status(400).json({ error: 'Error retrieving portion', details: err.message });
  }
};

// POST - Obtener todas las PortionTemplates
exports.getAll = async (req, res) => {
  try {
    const filters = req.body.filters || [];
    const mongoFilters = utils.buildMongoFilters(filters);

    mongoFilters.businessId = req.authUser.businessId;

    const portions = await PortionTemplate.find(mongoFilters)
      .select('-businessId -__v')
      .lean();

    res.json(portions);

  } catch (err) {
    console.error('💥 Error retrieving PortionTemplates:', err);
    res.status(500).json({ error: err.message });
  }
};