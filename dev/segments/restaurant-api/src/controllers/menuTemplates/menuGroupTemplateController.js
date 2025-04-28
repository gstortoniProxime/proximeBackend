const MenuGroupTemplate = require('../../models/MenuGroupTemplate');
const utils = require('../../utils/utils');

// POST - Crear un nuevo MenuGroupTemplate
exports.create = async (req, res) => {
  try {
    const authBusinessId = req.authUser.businessId;
    const { value } = req.body;

    // Validar que no exista el mismo value para este negocio
    const existingGroup = await MenuGroupTemplate.findOne({
      businessId: authBusinessId,
      value: value.trim().toLowerCase()
    });

    if (existingGroup) {
      return res.status(400).json({
        error: `Menu group "${value}" already exists for your business`
      });
    }

    const newGroup = new MenuGroupTemplate({
      ...req.body,
      value: value.trim().toLowerCase(),
      businessId: authBusinessId
    });

    await newGroup.save();

    const { businessId, ...cleaned } = newGroup.toObject();
    res.status(201).json(cleaned);

  } catch (err) {
    console.error('💥 Error creating MenuGroupTemplate:', err);
    res.status(400).json({ error: 'Error creating menu group', details: err.message });
  }
};

// PATCH - Actualizar un MenuGroupTemplate
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const authBusinessId = req.authUser.businessId;

    const existingGroup = await MenuGroupTemplate.findOne({
      _id: id,
      businessId: authBusinessId
    });

    if (!existingGroup) {
      return res.status(404).json({ error: 'Menu group not found for your business' });
    }

    const allowedFields = ['value', 'i18n', 'isActive'];

    // Validar duplicado si quiere cambiar el value
    if (req.body.value && req.body.value.trim().toLowerCase() !== existingGroup.value) {
      const duplicate = await MenuGroupTemplate.findOne({
        businessId: authBusinessId,
        value: req.body.value.trim().toLowerCase(),
        _id: { $ne: id }
      });

      if (duplicate) {
        return res.status(400).json({
          error: `Another menu group with value "${req.body.value}" already exists`
        });
      }

      existingGroup.value = req.body.value.trim().toLowerCase();
    }

    allowedFields.forEach(field => {
      if (field !== 'value' && req.body[field] !== undefined) {
        existingGroup[field] = req.body[field];
      }
    });

    await existingGroup.save();

    const { businessId, ...cleaned } = existingGroup.toObject({ flattenMaps: true });
    res.json(cleaned);

  } catch (err) {
    console.error('💥 Error updating MenuGroupTemplate:', err);
    res.status(400).json({ error: 'Error updating menu group', details: err.message });
  }
};

// GET - Obtener un MenuGroupTemplate por ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const authBusinessId = req.authUser.businessId;

    const group = await MenuGroupTemplate.findOne({
      _id: id,
      businessId: authBusinessId
    });

    if (!group) {
      return res.status(404).json({ error: 'Menu group not found for your business' });
    }

    const { businessId, ...cleaned } = group.toObject({ flattenMaps: true });
    res.json(cleaned);

  } catch (err) {
    console.error('💥 Error retrieving MenuGroupTemplate by ID:', err);
    res.status(400).json({ error: 'Error retrieving menu group', details: err.message });
  }
};

// POST - Obtener todos los MenuGroupTemplates
exports.getAll = async (req, res) => {
  try {
    const filters = req.body.filters || [];
    const mongoFilters = utils.buildMongoFilters(filters);

    mongoFilters.businessId = req.authUser.businessId;

    const groups = await MenuGroupTemplate.find(mongoFilters)
      .select('-businessId -__v')
      .lean();

    res.json(groups);

  } catch (err) {
    console.error('💥 Error retrieving MenuGroupTemplates:', err);
    res.status(500).json({ error: err.message });
  }
};