const Attribute = require('../../models/Attribute');
const utils = require('../../utils/utils');
exports.createAttribute = async (req, res) => {
  try {
    const attribute = new Attribute({
      ...req.body,
      businessId: req.authUser.businessId
    });

    await attribute.save();

    const { businessId, ...cleaned } = attribute.toObject(); 

    res.status(201).json(cleaned);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAttributeById = async (req, res) => {
  try {
    const attribute = await Attribute.findById(req.params.id);
    if (!attribute) {
      return res.status(404).json({ error: 'Attribute not found' });
    }

    // Solo validamos si el atributo es privado del negocio
    if (attribute.businessId) {
      utils.validateBusinessAccess(attribute.businessId, req.authUser);
    }

    res.json(attribute); // 🔁 ojo, estabas retornando "business" en lugar de "attribute"
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};

exports.getAttributes = async (req, res) => {
  try {
    const filters = req.body.filters || [];
    const mongoFilters = utils.buildMongoFilters(filters);

    // Mostrar solo atributos globales o propios del negocio
    mongoFilters.$or = [
      { businessId: req.authUser.businessId },
      { businessId: null }
    ];

    const attributes = await Attribute.find(mongoFilters)
      .select('-businessId -__v') // ocultamos businessId si querés
      .lean();

    res.json(attributes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updateAttribute = async (req, res) => {
  try {
    const attributeId = req.params.id;
    const updates = req.body;

    // Buscar el atributo
    const attribute = await Attribute.findById(attributeId);
    if (!attribute) {
      return res.status(404).json({ error: 'Atributo no encontrado' });
    }

    // Validar acceso si es un atributo del negocio
    if (attribute.businessId) {
      utils.validateBusinessAccess(attribute.businessId, req.authUser);
    }

    // Solo campos permitidos para edición
    const allowedFields = [
      'name',
      'type',
      'required',
      'isClientSelectable',
      'isCustomizable',
      'defaultValue',
      'description',
      'unit',
      'minValue',
      'maxValue',
      'step',
      'displayOrder',
      'group',
      'showInKitchen',
      'visibleInMenus',
      'dependsOnAttributeKey',
      'isActive'
    ];

    const actualUpdates = {};
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        actualUpdates[field] = updates[field];
      }
    });

    // Aplicar la actualización
    const updatedAttribute = await Attribute.findByIdAndUpdate(
      attributeId,
      { $set: actualUpdates },
      { new: true }
    ).lean();

    // Limpiar businessId antes de devolver
    const { businessId, ...cleaned } = updatedAttribute;
    res.json(cleaned);
    
  } catch (err) {
    console.error('[ERROR updateAttribute]', err);
    res.status(err.status || 500).json({ error: err.message });
  }
};