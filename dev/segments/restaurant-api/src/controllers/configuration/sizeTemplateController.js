// dev/segments/restaurant-api/src/controllers/configuration/sizeTemplateController.js

const SizeTemplate = require('../../models/SizeTemplate');
const utils = require('../../utils/utils');

// Crear un nuevo tamaño
exports.create = async (req, res) => {
  try {
    const { value, i18n, unit } = req.body;
    const authBusinessId = req.authUser.businessId;

    // Validar que no exista un tamaño duplicado para el mismo negocio
    const existingSize = await SizeTemplate.findOne({ businessId: authBusinessId, value });
    if (existingSize) {
      return res.status(400).json({ error: 'Size with this value already exists in your business' });
    }

    const newSize = new SizeTemplate({
      ...req.body,
      businessId: authBusinessId
    });

    await newSize.save();
    const { businessId, __v, ...cleaned } = newSize.toObject();
    res.status(201).json(cleaned);

  } catch (err) {
    console.error('💥 Error in sizeTemplate create:', err);
    res.status(400).json({ error: 'Error creating size', details: err.message });
  }
};

// Actualizar un tamaño
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { value, i18n, unit, isActive } = req.body;
    const authBusinessId = req.authUser.businessId;

    const existingSize = await SizeTemplate.findOne({
      _id: id,
      businessId: authBusinessId
    });

    if (!existingSize) {
      return res.status(404).json({ error: 'Size not found for your business' });
    }

    // Si actualiza value, validar duplicado
    if (value && value !== existingSize.value) {
      const duplicate = await SizeTemplate.findOne({ businessId: authBusinessId, value });
      if (duplicate) {
        return res.status(400).json({ error: 'Another size with this value already exists' });
      }
    }

    existingSize.value = value ?? existingSize.value;
    existingSize.i18n = i18n ?? existingSize.i18n;
    existingSize.unit = unit ?? existingSize.unit;
    existingSize.isActive = isActive ?? existingSize.isActive;

    await existingSize.save();
    const { businessId, __v, ...cleaned } = existingSize.toObject({ flattenMaps: true });
    res.json(cleaned);

  } catch (err) {
    console.error('💥 Error in sizeTemplate update:', err);
    res.status(400).json({ error: 'Error updating size', details: err.message });
  }
};

// Obtener todos los tamaños (con filtros si los hay)
exports.getAll = async (req, res) => {
  try {
    const filters = req.body.filters || [];
    const mongoFilters = utils.buildMongoFilters(filters);

    mongoFilters.businessId = req.authUser.businessId;

    const sizes = await SizeTemplate.find(mongoFilters)
      .select('-businessId -__v')
      .lean();

    res.json(sizes);

  } catch (err) {
    console.error('💥 Error in sizeTemplate getAll:', err);
    res.status(500).json({ error: err.message });
  }
};

// Obtener un tamaño específico por ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const authBusinessId = req.authUser.businessId;

    const size = await SizeTemplate.findOne({
      _id: id,
      businessId: authBusinessId
    });

    if (!size) {
      return res.status(404).json({ error: 'Size not found for your business' });
    }

    const { businessId, __v, ...cleaned } = size.toObject({ flattenMaps: true });
    res.json(cleaned);

  } catch (err) {
    console.error('💥 Error in sizeTemplate getById:', err);
    res.status(400).json({ error: 'Error retrieving size', details: err.message });
  }
};