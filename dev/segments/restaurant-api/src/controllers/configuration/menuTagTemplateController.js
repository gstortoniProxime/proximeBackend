const MenuTagTemplate = require('../../models/MenuTagTemplate');
const utils = require('../../utils/utils');

// POST - Crear nuevo MenuTagTemplate
exports.create = async (req, res) => {
  try {
    const authBusinessId = req.authUser.businessId;
    const { value, i18n, iconUrl, colorHex } = req.body;

    const newTag = new MenuTagTemplate({
      value,
      i18n,
      iconUrl,
      colorHex,
      businessId: authBusinessId
    });

    const duplicate = await MenuTagTemplate.findOne({
        businessId: authBusinessId,
        value
      });
      
      if (duplicate) {
        return res.status(400).json({ error: 'Another Menu Tag Template with this value already exists' });
      }

    await newTag.save();



    // Limpiamos para no retornar el businessId
    const { businessId, ...cleaned } = newTag.toObject();
    res.status(201).json(cleaned);

  } catch (err) {
    console.error('💥 Error in tag creation:', err);
    res.status(400).json({ error: 'Error creating menu tag', details: err.message });
  }
};

// PATCH - Actualizar un MenuTagTemplate
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { value, i18n, iconUrl, colorHex, isActive } = req.body;
    const authBusinessId = req.authUser.businessId;

    // Buscar el tag y validar que pertenezca al negocio
    const existingTag = await MenuTagTemplate.findOne({ _id: id, businessId: authBusinessId });

    if (!existingTag) {
      return res.status(404).json({ error: 'Menu tag not found for your business' });
    }

    // Actualizamos solo campos permitidos
    existingTag.value = value ?? existingTag.value;
    existingTag.i18n = i18n ?? existingTag.i18n;
    existingTag.iconUrl = iconUrl ?? existingTag.iconUrl;
    existingTag.colorHex = colorHex ?? existingTag.colorHex;
    existingTag.isActive = typeof isActive === 'boolean' ? isActive : existingTag.isActive;

    await existingTag.save();

    const { businessId, ...cleaned } = existingTag.toObject({ flattenMaps: true });
    res.json(cleaned);

  } catch (err) {
    console.error('💥 Error in tag update:', err);
    res.status(400).json({ error: 'Error updating menu tag', details: err.message });
  }
};

// GET - Obtener un MenuTagTemplate por ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const authBusinessId = req.authUser.businessId;

    const tag = await MenuTagTemplate.findOne({ _id: id, businessId: authBusinessId });

    if (!tag) {
      return res.status(404).json({ error: 'Menu tag not found for your business' });
    }

    const { businessId, ...cleaned } = tag.toObject({ flattenMaps: true });
    res.json(cleaned);

  } catch (err) {
    console.error('💥 Error in tag getById:', err);
    res.status(400).json({ error: 'Error retrieving menu tag', details: err.message });
  }
};

// POST - Buscar múltiples MenuTagTemplates
exports.getTags = async (req, res) => {
  try {
    const filters = req.body.filters || [];
    const mongoFilters = utils.buildMongoFilters(filters);

    mongoFilters.businessId = req.authUser.businessId;

    const tags = await MenuTagTemplate.find(mongoFilters)
      .select('-businessId -__v') // siempre ocultamos estos dos
      .lean();

    res.json(tags);

  } catch (err) {
    console.error('💥 Error in tag getTags:', err);
    res.status(500).json({ error: err.message });
  }
};