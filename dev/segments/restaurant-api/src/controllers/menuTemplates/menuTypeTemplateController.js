const MenuTypeTemplate = require('../../models/MenuTypeTemplate');
const utils = require('../../utils/utils');

// Crear un nuevo tipo de menú
exports.create = async (req, res) => {
  try {
    const authBusinessId = req.authUser.businessId;
    const { value, i18n } = req.body;

    // Validar si ya existe el mismo value en el negocio
    const exists = await MenuTypeTemplate.findOne({ value, businessId: authBusinessId });
    if (exists) {
      return res.status(400).json({ error: 'Menu type with this value already exists for your business' });
    }

    const newType = new MenuTypeTemplate({
      ...req.body,
      businessId: authBusinessId
    });

    await newType.save();
    const { businessId, ...cleaned } = newType.toObject();

    res.status(201).json(cleaned);

  } catch (err) {
    console.error('💥 Error creating menu type:', err);
    res.status(400).json({ error: 'Error creating menu type', details: err.message });
  }
};

// Actualizar un tipo de menú
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { value, i18n, isActive } = req.body;
    const authBusinessId = req.authUser.businessId;

    const existing = await MenuTypeTemplate.findOne({
      _id: id,
      businessId: authBusinessId
    });

    if (!existing) {
      return res.status(404).json({ error: 'Menu type not found for your business' });
    }

    // Validar si está intentando poner un value duplicado
    if (value && value !== existing.value) {
      const duplicated = await MenuTypeTemplate.findOne({
        _id: { $ne: id },
        value,
        businessId: authBusinessId
      });

      if (duplicated) {
        return res.status(400).json({ error: 'Another menu type with this value already exists' });
      }
    }

    // Actualizamos sólo campos permitidos
    existing.value = value ?? existing.value;
    existing.i18n = i18n ?? existing.i18n;
    existing.isActive = isActive ?? existing.isActive;

    await existing.save();
    const { businessId, ...cleaned } = existing.toObject({ flattenMaps: true });

    res.json(cleaned);

  } catch (err) {
    console.error('💥 Error updating menu type:', err);
    res.status(400).json({ error: 'Error updating menu type', details: err.message });
  }
};

// Obtener un tipo de menú por ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const authBusinessId = req.authUser.businessId;

    const menuType = await MenuTypeTemplate.findOne({
      _id: id,
      businessId: authBusinessId
    });

    if (!menuType) {
      return res.status(404).json({ error: 'Menu type not found for your business' });
    }

    const { businessId, ...cleaned } = menuType.toObject({ flattenMaps: true });
    res.json(cleaned);

  } catch (err) {
    console.error('💥 Error getting menu type by id:', err);
    res.status(400).json({ error: 'Error retrieving menu type', details: err.message });
  }
};

// Listar todos los tipos de menú con filtros
exports.getMenuTypes = async (req, res) => {
  try {
    const filters = req.body.filters || [];
    const mongoFilters = utils.buildMongoFilters(filters);

    mongoFilters.businessId = req.authUser.businessId;

    const types = await MenuTypeTemplate.find(mongoFilters)
      .select('-businessId -__v')
      .lean();

    res.json(types);

  } catch (err) {
    console.error('💥 Error getting menu types:', err);
    res.status(500).json({ error: err.message });
  }
};