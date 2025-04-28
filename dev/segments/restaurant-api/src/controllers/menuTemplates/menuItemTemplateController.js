const MenuItemTemplate = require('../../models/MenuItemTemplate');
const MenuGroupTemplate = require('../../models/MenuGroupTemplate');
const ModifierGroupTemplate = require('../../models/ModifierGroupTemplate');
const SalesCategoryTemplate = require('../../models/SalesCategoryTemplate');
const PortionTemplate = require('../../models/PortionTemplate');
const MenuTagTemplate = require('../../models/MenuTagTemplate');
const AllergenRegistry = require('../../models/AllergenRegistry');
const utils = require('../../utils/utils');

// Crear nuevo MenuItemTemplate
exports.create = async (req, res) => {
  try {
    const authBusinessId = req.authUser.businessId;
    const {
      value,
      i18n,
      salesCategoryId,
      menuGroupId,
      isActive,
      price,
      pricingRuleId,
      modifiers,
      portions,
      allergenIds,
      dietaryTagIds,
      nutritionalInfo,
      imageUrl,
      colorHex,
      mediaGallery
    } = req.body;

    // Validaciones principales
    const [salesCategory, menuGroup] = await Promise.all([
      SalesCategoryTemplate.findById(salesCategoryId),
      MenuGroupTemplate.findById(menuGroupId)
    ]);

    if (!salesCategory) {
      return res.status(400).json({ error: 'SalesCategoryTemplate not found' });
    }

    if (!menuGroup) {
      return res.status(400).json({ error: 'MenuGroupTemplate not found' });
    }

    if (modifiers && modifiers.length > 0) {
      const modifierIds = modifiers.map(m => m.modifierGroupId);
      const foundModifiers = await ModifierGroupTemplate.find({ _id: { $in: modifierIds } }).select('_id');
      if (foundModifiers.length !== modifierIds.length) {
        return res.status(400).json({ error: 'One or more ModifierGroupTemplate IDs do not exist' });
      }
    }

    if (portions && portions.length > 0) {
      const portionIds = portions.map(p => p.portionId);
      const foundPortions = await PortionTemplate.find({ _id: { $in: portionIds } }).select('_id');
      if (foundPortions.length !== portionIds.length) {
        return res.status(400).json({ error: 'One or more PortionTemplate IDs do not exist' });
      }
    }

    if (allergenIds && allergenIds.length > 0) {
      const foundAllergens = await AllergenRegistry.find({ _id: { $in: allergenIds } }).select('_id');
      if (foundAllergens.length !== allergenIds.length) {
        return res.status(400).json({ error: 'One or more Allergen IDs do not exist' });
      }
    }

    if (dietaryTagIds && dietaryTagIds.length > 0) {
      const foundDietaryTags = await MenuTagTemplate.find({ _id: { $in: dietaryTagIds } }).select('_id');
      if (foundDietaryTags.length !== dietaryTagIds.length) {
        return res.status(400).json({ error: 'One or more Dietary Tag IDs do not exist' });
      }
    }

    const newItem = new MenuItemTemplate({
      businessId: authBusinessId,
      value: value.trim().toLowerCase(),
      i18n,
      salesCategoryId,
      menuGroupId,
      isActive,
      price,
      pricingRuleId,
      modifiers,
      portions,
      allergenIds,
      dietaryTagIds,
      nutritionalInfo,
      imageUrl,
      colorHex,
      mediaGallery
    });

    await newItem.save();

    const { businessId, ...cleaned } = newItem.toObject({ flattenMaps: true });
    res.status(201).json(cleaned);

  } catch (err) {
    console.error('💥 Error creating MenuItemTemplate:', err);
    res.status(400).json({ error: 'Error creating menu item', details: err.message });
  }
};

// Actualizar MenuItemTemplate
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const authBusinessId = req.authUser.businessId;
    const {
      value,
      i18n,
      salesCategoryId,
      menuGroupId,
      isActive,
      price,
      pricingRuleId,
      modifiers,
      portions,
      allergenIds,
      dietaryTagIds,
      nutritionalInfo,
      imageUrl,
      colorHex,
      mediaGallery
    } = req.body;

    const item = await MenuItemTemplate.findOne({
      _id: id,
      businessId: authBusinessId
    });

    if (!item) {
      return res.status(404).json({ error: 'MenuItemTemplate not found for your business' });
    }

    if (salesCategoryId) {
      const salesCategory = await SalesCategoryTemplate.findById(salesCategoryId);
      if (!salesCategory) {
        return res.status(400).json({ error: 'SalesCategoryTemplate not found' });
      }
    }

    if (menuGroupId) {
      const menuGroup = await MenuGroupTemplate.findById(menuGroupId);
      if (!menuGroup) {
        return res.status(400).json({ error: 'MenuGroupTemplate not found' });
      }
    }

    if (modifiers && modifiers.length > 0) {
      const modifierIds = modifiers.map(m => m.modifierGroupId);
      const foundModifiers = await ModifierGroupTemplate.find({ _id: { $in: modifierIds } }).select('_id');
      if (foundModifiers.length !== modifierIds.length) {
        return res.status(400).json({ error: 'One or more ModifierGroupTemplate IDs do not exist' });
      }
    }

    if (portions && portions.length > 0) {
      const portionIds = portions.map(p => p.portionId);
      const foundPortions = await PortionTemplate.find({ _id: { $in: portionIds } }).select('_id');
      if (foundPortions.length !== portionIds.length) {
        return res.status(400).json({ error: 'One or more PortionTemplate IDs do not exist' });
      }
    }

    if (allergenIds && allergenIds.length > 0) {
      const foundAllergens = await AllergenRegistry.find({ _id: { $in: allergenIds } }).select('_id');
      if (foundAllergens.length !== allergenIds.length) {
        return res.status(400).json({ error: 'One or more Allergen IDs do not exist' });
      }
    }

    if (dietaryTagIds && dietaryTagIds.length > 0) {
      const foundDietaryTags = await MenuTagTemplate.find({ _id: { $in: dietaryTagIds } }).select('_id');
      if (foundDietaryTags.length !== dietaryTagIds.length) {
        return res.status(400).json({ error: 'One or more Dietary Tag IDs do not exist' });
      }
    }

    const allowedFields = [
      'value', 'i18n', 'salesCategoryId', 'menuGroupId',
      'isActive', 'price', 'pricingRuleId', 'modifiers',
      'portions', 'allergenIds', 'dietaryTagIds',
      'nutritionalInfo', 'imageUrl', 'colorHex', 'mediaGallery'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        item[field] = req.body[field];
      }
    });

    await item.save();

    const { businessId, ...cleaned } = item.toObject({ flattenMaps: true });
    res.json(cleaned);

  } catch (err) {
    console.error('💥 Error updating MenuItemTemplate:', err);
    res.status(400).json({ error: 'Error updating menu item', details: err.message });
  }
};

// Obtener MenuItemTemplate por ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const authBusinessId = req.authUser.businessId;

    const item = await MenuItemTemplate.findOne({
      _id: id,
      businessId: authBusinessId
    });

    if (!item) {
      return res.status(404).json({ error: 'MenuItemTemplate not found for your business' });
    }

    const { businessId, ...cleaned } = item.toObject({ flattenMaps: true });
    res.json(cleaned);

  } catch (err) {
    console.error('💥 Error retrieving MenuItemTemplate by ID:', err);
    res.status(400).json({ error: 'Error retrieving menu item', details: err.message });
  }
};

// Obtener todos los MenuItemTemplates filtrados
exports.getAll = async (req, res) => {
  try {
    const filters = req.body.filters || [];
    const mongoFilters = utils.buildMongoFilters(filters);

    mongoFilters.businessId = req.authUser.businessId;

    const items = await MenuItemTemplate.find(mongoFilters)
      .select('-businessId -__v')
      .lean();

    res.json(items);

  } catch (err) {
    console.error('💥 Error retrieving MenuItemTemplates:', err);
    res.status(500).json({ error: err.message });
  }
};