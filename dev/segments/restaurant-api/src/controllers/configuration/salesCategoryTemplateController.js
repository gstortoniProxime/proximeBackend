const SalesCategoryTemplate = require('../../models/SalesCategoryTemplate');
const utils = require('../../utils/utils');

// Crear nueva categoría de venta
exports.createSalesCategory = async (req, res) => {
  try {
    const authBusinessId = req.authUser.businessId;
    const { value, i18n, iconUrl, colorHex, isDefault } = req.body;

    const newCategory = new SalesCategoryTemplate({
      businessId: authBusinessId,
      value,
      i18n,
      iconUrl,
      colorHex,
      isDefault: isDefault || false
    });
       const duplicate = await SalesCategoryTemplate.findOne({
            businessId: authBusinessId,
            value
          });
          
          if (duplicate) {
            return res.status(400).json({ error: 'Another Sales Categorie with this value already exists' });
          }
    

    await newCategory.save();

    const { businessId, __v, ...cleaned } = newCategory.toObject({ flattenMaps: true });
    res.status(201).json(cleaned);

  } catch (err) {
    console.error('💥 Error in createSalesCategory:', err);
    res.status(400).json({ error: 'Error creating sales category', details: err.message });
  }
};

// Actualizar categoría de venta
exports.updateSalesCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { value, i18n, iconUrl, colorHex, isDefault, isActive } = req.body;
    const authBusinessId = req.authUser.businessId;

    const existingCategory = await SalesCategoryTemplate.findOne({
      _id: id,
      businessId: authBusinessId
    });

    if (!existingCategory) {
      return res.status(404).json({ error: 'Sales category not found for your business' });
    }

    // Solo actualizamos campos permitidos
    existingCategory.value = value ?? existingCategory.value;
    existingCategory.i18n = i18n ?? existingCategory.i18n;
    existingCategory.iconUrl = iconUrl ?? existingCategory.iconUrl;
    existingCategory.colorHex = colorHex ?? existingCategory.colorHex;
    existingCategory.isDefault = isDefault ?? existingCategory.isDefault;
    existingCategory.isActive = isActive ?? existingCategory.isActive;

    await existingCategory.save();

    const { businessId, __v, ...cleaned } = existingCategory.toObject({ flattenMaps: true });
    res.json(cleaned);

  } catch (err) {
    console.error('💥 Error in updateSalesCategory:', err);
    res.status(400).json({ error: 'Error updating sales category', details: err.message });
  }
};

// Obtener una categoría por ID
exports.getSalesCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const authBusinessId = req.authUser.businessId;

    const category = await SalesCategoryTemplate.findOne({
      _id: id,
      businessId: authBusinessId
    });

    if (!category) {
      return res.status(404).json({ error: 'Sales category not found for your business' });
    }

    const { businessId, __v, ...cleaned } = category.toObject({ flattenMaps: true });
    res.json(cleaned);

  } catch (err) {
    console.error('💥 Error in getSalesCategoryById:', err);
    res.status(400).json({ error: 'Error retrieving sales category', details: err.message });
  }
};

// Buscar todas las categorías de venta (con filtros)
exports.getSalesCategories = async (req, res) => {
  try {
    const filters = req.body.filters || [];
    const mongoFilters = utils.buildMongoFilters(filters);

    mongoFilters.businessId = req.authUser.businessId;

    const categories = await SalesCategoryTemplate.find(mongoFilters)
      .select('-businessId -__v')
      .lean({ flattenMaps: true });

    res.json(categories);

  } catch (err) {
    console.error('💥 Error in getSalesCategories:', err);
    res.status(500).json({ error: err.message });
  }
};

// Soft delete de categoría de venta
exports.deleteSalesCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const authBusinessId = req.authUser.businessId;

    const category = await SalesCategoryTemplate.findOne({
      _id: id,
      businessId: authBusinessId
    });

    if (!category) {
      return res.status(404).json({ error: 'Sales category not found for your business' });
    }

    category.isActive = false;
    await category.save();

    const { businessId, __v, ...cleaned } = category.toObject({ flattenMaps: true });
    res.json(cleaned);

  } catch (err) {
    console.error('💥 Error in deleteSalesCategory:', err);
    res.status(400).json({ error: 'Error deactivating sales category', details: err.message });
  }
};