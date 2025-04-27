const ModifierOptionTemplate = require('../../models/ModifierOptionTemplate');
const utils = require('../../utils/utils');

// POST - Crear nuevo modificador
exports.create = async (req, res) => {
    try {
      const authBusinessId = req.authUser.businessId;
      const { value } = req.body;
  
      // Validación previa: ¿ya existe el mismo "value" para este business?
      const existingModifier = await ModifierOptionTemplate.findOne({
        businessId: authBusinessId,
        value: value.trim().toLowerCase()
      });
  
      if (existingModifier) {
        return res.status(400).json({
          error: `Modifier option "${value}" already exists for your business`
        });
      }
  
      const newModifier = new ModifierOptionTemplate({
        ...req.body,
        value: value.trim().toLowerCase(), // Normalizamos el value a lowercase
        businessId: authBusinessId
      });
  
      await newModifier.save();
  
      const { businessId, ...cleaned } = newModifier.toObject();
      res.status(201).json(cleaned);
  
    } catch (err) {
      console.error('💥 Error creating ModifierOptionTemplate:', err);
      res.status(400).json({ error: 'Error creating modifier option', details: err.message });
    }
  };

// PATCH - Actualizar un modificador existente
exports.update = async (req, res) => {
    try {
      const { id } = req.params;
      const authBusinessId = req.authUser.businessId;
  
      const existingModifier = await ModifierOptionTemplate.findOne({
        _id: id,
        businessId: authBusinessId
      });
  
      if (!existingModifier) {
        return res.status(404).json({ error: 'Modifier option not found for your business' });
      }
  
      const allowedFields = [
        'value', 'i18n', 'price', 'calories', 'emoji',
        'imageUrl', 'defaultQuantity', 'minQuantity', 'maxQuantity', 'isActive'
      ];
  
      // Si el usuario intenta cambiar el "value", validamos duplicados
      if (req.body.value && req.body.value.trim().toLowerCase() !== existingModifier.value) {
        const duplicate = await ModifierOptionTemplate.findOne({
          businessId: authBusinessId,
          value: req.body.value.trim().toLowerCase(),
          _id: { $ne: id } // excluimos el que estamos editando
        });
  
        if (duplicate) {
          return res.status(400).json({ error: `Another modifier option with value "${req.body.value}" already exists` });
        }
  
        // Normalizamos el nuevo value
        existingModifier.value = req.body.value.trim().toLowerCase();
      }
  
      // Actualizamos otros campos permitidos
      allowedFields.forEach(field => {
        if (field !== 'value' && req.body[field] !== undefined) {
          existingModifier[field] = req.body[field];
        }
      });
  
      await existingModifier.save();
  
      const { businessId, ...cleaned } = existingModifier.toObject({ flattenMaps: true });
      res.json(cleaned);
  
    } catch (err) {
      console.error('💥 Error updating ModifierOptionTemplate:', err);
      res.status(400).json({ error: 'Error updating modifier option', details: err.message });
    }
  };


// GET - Obtener un modificador por ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const authBusinessId = req.authUser.businessId;

    const modifier = await ModifierOptionTemplate.findOne({
      _id: id,
      businessId: authBusinessId
    });

    if (!modifier) {
      return res.status(404).json({ error: 'Modifier option not found for your business' });
    }

    const { businessId, ...cleaned } = modifier.toObject({ flattenMaps: true });
    res.json(cleaned);

  } catch (err) {
    console.error('💥 Error getting ModifierOptionTemplate by ID:', err);
    res.status(400).json({ error: 'Error retrieving modifier option', details: err.message });
  }
};

// POST - Obtener lista de modificadores filtrados
exports.getAll = async (req, res) => {
  try {
    const filters = req.body.filters || [];
    const mongoFilters = utils.buildMongoFilters(filters);

    mongoFilters.businessId = req.authUser.businessId;

    const modifiers = await ModifierOptionTemplate.find(mongoFilters)
      .select('-businessId -__v')
      .lean();

    res.json(modifiers);

  } catch (err) {
    console.error('💥 Error getting ModifierOptionTemplates list:', err);
    res.status(500).json({ error: err.message });
  }
};