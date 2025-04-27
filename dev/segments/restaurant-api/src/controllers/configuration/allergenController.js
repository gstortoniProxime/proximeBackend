const AllergenRegistry = require('../../models/AllergenRegistry');
const utils = require('../../utils/utils');

// POST - Crear nuevo alérgeno
exports.createAllergen = async (req, res) => {
  try {
    const { value, i18n, iconUrl } = req.body;
    const authBusinessId = req.authUser.businessId;

    const newAllergen = new AllergenRegistry({
      value,
      i18n,
      iconUrl,
      businessId: authBusinessId
    });

       const duplicate = await AllergenRegistry.findOne({
            businessId: authBusinessId,
            value
          });
          
          if (duplicate) {
            return res.status(400).json({ error: 'Another Allergen with this value already exists' });
          }

    await newAllergen.save();

    const { businessId, __v, ...cleaned } = newAllergen.toObject();
    res.status(201).json(cleaned);

  } catch (err) {
    console.error('💥 Error in allergen creation:', err);
    res.status(400).json({ error: 'Error creating allergen', details: err.message });
  }
};

// PATCH - Actualizar alérgeno
exports.updateAllergen = async (req, res) => {
  try {
    const { id } = req.params;
    const { value, i18n, iconUrl, isActive } = req.body;
    const authBusinessId = req.authUser.businessId;

    const existingAllergen = await AllergenRegistry.findOne({
      _id: id,
      businessId: authBusinessId
    });

    if (!existingAllergen) {
      return res.status(404).json({ error: 'Allergen not found for your business' });
    }

    existingAllergen.value = value ?? existingAllergen.value;
    existingAllergen.i18n = i18n ?? existingAllergen.i18n;
    existingAllergen.iconUrl = iconUrl ?? existingAllergen.iconUrl;
    existingAllergen.isActive = isActive ?? existingAllergen.isActive;

    await existingAllergen.save();

    const { businessId, __v, ...cleaned } = existingAllergen.toObject();
    res.json(cleaned);

  } catch (err) {
    console.error('💥 Error in allergen update:', err);
    res.status(400).json({ error: 'Error updating allergen', details: err.message });
  }
};

// GET - Obtener un alérgeno por ID
exports.getAllergenById = async (req, res) => {
    try {
      const { id } = req.params;
      const authBusinessId = req.authUser.businessId;
  
      const allergen = await AllergenRegistry.findOne({
        _id: id,
        businessId: authBusinessId
      });
  
      if (!allergen) {
        return res.status(404).json({ error: 'Allergen not found for your business' });
      }
  
      const { businessId, __v, ...cleaned } = allergen.toObject({ flattenMaps: true }); // <<<< 🔥 Acá el fix mágico
      res.json(cleaned);
  
    } catch (err) {
      console.error('💥 Error in allergen getById:', err);
      res.status(400).json({ error: 'Error retrieving allergen', details: err.message });
    }
  };

// POST - Obtener lista de alérgenos por filtros
exports.getAllergens = async (req, res) => {
  try {
    const filters = req.body.filters || [];
    const mongoFilters = utils.buildMongoFilters(filters);

    mongoFilters.businessId = req.authUser.businessId;

    const allergens = await AllergenRegistry.find(mongoFilters)
      .select('-businessId -__v')
      .lean();

    res.json(allergens);

  } catch (err) {
    console.error('💥 Error in allergen getAllergens:', err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE - Soft delete del alérgeno
exports.deleteAllergen = async (req, res) => {
  try {
    const { id } = req.params;
    const authBusinessId = req.authUser.businessId;

    const allergen = await AllergenRegistry.findOne({
      _id: id,
      businessId: authBusinessId
    });

    if (!allergen) {
      return res.status(404).json({ error: 'Allergen not found for your business' });
    }

    allergen.isActive = false;
    await allergen.save();

    res.json({ message: 'Allergen disabled successfully' });

  } catch (err) {
    console.error('💥 Error in allergen delete:', err);
    res.status(400).json({ error: 'Error disabling allergen', details: err.message });
  }
};