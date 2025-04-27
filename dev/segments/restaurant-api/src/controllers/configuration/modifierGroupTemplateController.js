const ModifierGroupTemplate = require('../../models/ModifierGroupTemplate');
const utils = require('../../utils/utils');

// POST - Crear un nuevo grupo de modificadores
exports.create = async (req, res) => {
  try {
    const authBusinessId = req.authUser.businessId;
    const { value } = req.body;

    // Validación previa: ¿ya existe el mismo "value" para este negocio?
    const existingGroup = await ModifierGroupTemplate.findOne({
      businessId: authBusinessId,
      value: value.trim().toLowerCase()
    });

    if (existingGroup) {
      return res.status(400).json({
        error: `Modifier group "${value}" already exists for your business`
      });
    }

    const newGroup = new ModifierGroupTemplate({
      ...req.body,
      value: value.trim().toLowerCase(),
      businessId: authBusinessId
    });

    await newGroup.save();

    const { businessId, ...cleaned } = newGroup.toObject();
    res.status(201).json(cleaned);

  } catch (err) {
    console.error('💥 Error creating ModifierGroupTemplate:', err);
    res.status(400).json({ error: 'Error creating modifier group', details: err.message });
  }
};

// PATCH - Actualizar un grupo de modificadores
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const authBusinessId = req.authUser.businessId;

    const existingGroup = await ModifierGroupTemplate.findOne({
      _id: id,
      businessId: authBusinessId
    });

    if (!existingGroup) {
      return res.status(404).json({ error: 'Modifier group not found for your business' });
    }

    const allowedFields = [
      'value', 'i18n', 'minSelections', 'maxSelections', 
      'isRequired', 'enablePortions', 'modifiers', 'isActive'
    ];

    // Si el usuario intenta cambiar el "value", validamos duplicados
    if (req.body.value && req.body.value.trim().toLowerCase() !== existingGroup.value) {
      const duplicate = await ModifierGroupTemplate.findOne({
        businessId: authBusinessId,
        value: req.body.value.trim().toLowerCase(),
        _id: { $ne: id }
      });

      if (duplicate) {
        return res.status(400).json({
          error: `Another modifier group with value "${req.body.value}" already exists`
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

    const { businessId, ...cleaned } = existingGroup.toObject();
    res.json(cleaned);

  } catch (err) {
    console.error('💥 Error updating ModifierGroupTemplate:', err);
    res.status(400).json({ error: 'Error updating modifier group', details: err.message });
  }
};

// GET - Obtener un grupo de modificadores por ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const authBusinessId = req.authUser.businessId;

    const group = await ModifierGroupTemplate.findOne({
      _id: id,
      businessId: authBusinessId
    });

    if (!group) {
      return res.status(404).json({ error: 'Modifier group not found for your business' });
    }

    const { businessId, ...cleaned } = group.toObject();
    res.json(cleaned);

  } catch (err) {
    console.error('💥 Error retrieving ModifierGroupTemplate by ID:', err);
    res.status(400).json({ error: 'Error retrieving modifier group', details: err.message });
  }
};

// POST - Obtener todos los grupos de modificadores
exports.getAll = async (req, res) => {
  try {
    const filters = req.body.filters || [];
    const mongoFilters = utils.buildMongoFilters(filters);

    mongoFilters.businessId = req.authUser.businessId;

    const groups = await ModifierGroupTemplate.find(mongoFilters)
      .select('-businessId -__v')
      .lean();

    res.json(groups);

  } catch (err) {
    console.error('💥 Error retrieving ModifierGroupTemplates:', err);
    res.status(500).json({ error: err.message });
  }
};