const TaxRate = require('../../models/TaxRateRegistry');
const utils = require('../../utils/utils');
// GET - Obtener todas las tasas por businessId
exports.create = async (req, res) => {
  try {
    const { country, state, county, city, isDefault } = req.body;
    const authBusinessId = req.authUser.businessId; // ← este es el válido

    if (isDefault) {
      const existingDefault = await TaxRate.findOne({
        businessId: authBusinessId,
        country,
        state,
        county: county || null,
        city: city || null,
        isDefault: true
      });

      if (existingDefault) {
        return res.status(400).json({
          error: 'Default tax rate already exists for this region'
        });
      }
    }

    const newTax = new TaxRate({
      ...req.body,
      businessId: authBusinessId
    });

    await newTax.save();

    // Limpiamos para no retornar businessId al cliente
    const { businessId, ...cleaned } = newTax.toObject();

    res.status(201).json(cleaned);

  } catch (err) {
    console.error('💥 Error in tax creation:', err);
    res.status(400).json({ error: 'Error creating tax rate', details: err });
  }
};
  
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, rate, appliesTo, isDefault } = req.body;
    const authBusinessId = req.authUser.businessId; // ← Siempre desde el token

    // Buscamos el impuesto, pero solo si pertenece al mismo business
    const existingTax = await TaxRate.findOne({
      _id: id,
      businessId: authBusinessId
    });

    if (!existingTax) {
      return res.status(404).json({ error: 'Tax rate not found for your business' });
    }

    // Validación: no permitir duplicado de default en misma región
    if (isDefault) {
      const existingDefault = await TaxRate.findOne({
        _id: { $ne: id }, // otro registro
        businessId: authBusinessId,
        country: existingTax.country,
        state: existingTax.state,
        county: existingTax.county || null,
        city: existingTax.city || null,
        isDefault: true
      });

      if (existingDefault) {
        return res.status(400).json({
          error: 'Another default tax rate already exists for this region'
        });
      }
    }

    // Actualizamos solo campos permitidos
    existingTax.name = name ?? existingTax.name;
    existingTax.rate = rate ?? existingTax.rate;
    existingTax.appliesTo = appliesTo ?? existingTax.appliesTo;
    existingTax.isDefault = isDefault ?? existingTax.isDefault;

    await existingTax.save();
    const { businessId, ...cleaned } = existingTax.toObject();
    res.json(cleaned);
    //res.json(existingTax);

  } catch (err) {
    console.error('💥 Error in tax update:', err);
    res.status(400).json({ error: 'Error updating tax rate', details: err });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const authBusinessId = req.authUser.businessId;

    // Buscar el TaxRate que pertenezca a su propio business
    const taxRate = await TaxRate.findOne({
      _id: id,
      businessId: authBusinessId
    });

    if (!taxRate) {
      return res.status(404).json({ error: 'Tax rate not found for your business' });
    }

    // Limpiar el businessId antes de responder
    const { businessId, ...cleaned } = taxRate.toObject();
    res.json(cleaned);

  } catch (err) {
    console.error('💥 Error in tax getById:', err);
    res.status(400).json({ error: 'Error retrieving tax rate', details: err });
  }
};

exports.getTaxRates = async (req, res) => {
  try {
    const filters = req.body.filters || [];
    const mongoFilters = utils.buildMongoFilters(filters);

    // Mostrar solo taxes del negocio actual
    mongoFilters.businessId = req.authUser.businessId;

    const taxRates = await TaxRate.find(mongoFilters)
      .select('-businessId -__v') // ocultamos businessId y versión de Mongoose
      .lean();

    res.json(taxRates);

  } catch (err) {
    console.error('💥 Error in tax getTaxRates:', err);
    res.status(500).json({ error: err.message });
  }
};