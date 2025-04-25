const AttributeValue = require('../../models/AttributeValue');
const utils = require('../../utils/utils');
exports.createAttributeValue = async (req, res) => {
  try {
    const businessId = req.authUser.businessId;

    const values = Array.isArray(req.body) ? req.body : [req.body];

    const cleanValues = values.map(({ businessId: _, ...val }) => ({
      ...val,
      businessId
    }));

    const created = await AttributeValue.insertMany(cleanValues);

    // Ocultamos solo el businessId
    const response = created.map(doc => {
      const { businessId, ...rest } = doc.toObject();
      return rest;
    });

    res.status(201).json(response);
  } catch (err) {
    console.error('[ERROR AttributeValue Bulk]', err);
    res.status(400).json({ error: err.message });
  }
};



exports.getAttributeValuesById = async (req, res) => {
  try {
    const attributeValues = await AttributeValue.find({ attributeId: req.params.id }).lean();

    if (!attributeValues || attributeValues.length === 0) {
      return res.status(404).json({ error: 'Attribute values not found' });
    }

    // Validamos businessId solo si alguno tiene definido (atributos privados)
    const hasPrivate = attributeValues.some(av => av.businessId);

    if (hasPrivate) {
      const first = attributeValues.find(av => av.businessId); // agarramos cualquiera
      utils.validateBusinessAccess(first.businessId, req.authUser);
    }

    const response = attributeValues.map(({ businessId, ...rest }) => rest);
    res.json(response);

  } catch (err) {
    console.error('[ERROR getAttributeValuesById]', err);
    res.status(err.status || 500).json({ error: err.message });
  }
};

exports.updateAttributeValuesByAttributeId = async (req, res) => {
  try {
    const attributeId = req.params.attributeId;
    const values = Array.isArray(req.body) ? req.body : [req.body];

    const results = [];

    for (const item of values) {
      const { _id, ...updates } = item;

      const existing = await AttributeValue.findById(_id);
      if (!existing) continue;

      //Validar que el valor pertenezca al atributo correcto
      if (existing.attributeId.toString() !== attributeId) {
        return res.status(400).json({
          error: `El valor ${_id} no pertenece al atributo ${attributeId}`
        });
      }

      //Validar que el negocio tenga acceso
      utils.validateBusinessAccess(existing.businessId, req.authUser);

      // Solo campos permitidos
      const allowedFields = ['value', 'emoji', 'imageUrl', 'i18n', 'isActive'];
      const actualUpdates = {};

      allowedFields.forEach(field => {
        if (updates[field] !== undefined) {
          actualUpdates[field] = updates[field];
        }
      });

      const updated = await AttributeValue.findByIdAndUpdate(
        _id,
        { $set: actualUpdates },
        { new: true }
      ).lean();

      // Limpiar businessId antes de devolver
      const { businessId, ...cleaned } = updated;
      results.push(cleaned);
    }

    res.json(results);
  } catch (err) {
    console.error('[ERROR PATCH /attributeValue/:atrributeId]', err);
    res.status(err.status || 500).json({ error: err.message });
  }
};