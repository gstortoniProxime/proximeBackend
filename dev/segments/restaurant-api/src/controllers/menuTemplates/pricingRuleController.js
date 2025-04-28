const PricingRule = require('../../models/PricingRule');
const SalesCategoryTemplate = require('../../models/SalesCategoryTemplate');
const MenuItemTemplate = require('../../models/MenuItemTemplate');
const utils = require('../../utils/utils');

// Crear nueva PricingRule
// Update your create function to use salesCategoryIds instead of salesCategoryId
exports.create = async (req, res) => {
    try {
      const authBusinessId = req.authUser.businessId;
      const { 
        value, 
        i18n, 
        salesCategoryId, // Keep accepting this for backward compatibility
        salesCategoryIds = salesCategoryId ? [salesCategoryId] : [], // Convert single ID to array
        menuItemIds = [], 
        discountPercentage, 
        startDate, 
        endDate, 
        timeSchedules = [], 
        isActive = true 
      } = req.body;
  
      // Validar unicidad del value
      const duplicate = await PricingRule.findOne({
        businessId: authBusinessId,
        value: value.trim().toLowerCase()
      });
  
      if (duplicate) {
        return res.status(400).json({ error: 'Another PricingRule with the same value already exists' });
      }
  
      // Validar que exista la SalesCategory para este business
      // If there's a single salesCategoryId or an array of salesCategoryIds
      const categoryIdToCheck = salesCategoryId || (salesCategoryIds.length > 0 ? salesCategoryIds[0] : null);
      
      if (categoryIdToCheck) {
        const categoryExists = await SalesCategoryTemplate.findOne({
          _id: categoryIdToCheck,
          businessId: authBusinessId
        });
  
        if (!categoryExists) {
          return res.status(400).json({ error: 'Sales category does not exist for your business' });
        }
      }
  
      // Validar MenuItems (si envían)
      if (menuItemIds.length > 0 && categoryIdToCheck) {
        const menuItems = await MenuItemTemplate.find({
          _id: { $in: menuItemIds },
          businessId: authBusinessId
        }).select('_id salesCategoryId');
  
        if (menuItems.length !== menuItemIds.length) {
          return res.status(400).json({ error: 'One or more MenuItems do not exist for your business' });
        }
  
        const invalidMenuItems = menuItems.filter(item => item.salesCategoryId.toString() !== categoryIdToCheck.toString());
  
        if (invalidMenuItems.length > 0) {
          return res.status(400).json({ error: 'One or more MenuItems do not belong to the selected SalesCategory' });
        }
      }
  
      const newRule = new PricingRule({
        businessId: authBusinessId,
        value: value.trim().toLowerCase(),
        i18n,
        salesCategoryIds: salesCategoryIds.length > 0 ? salesCategoryIds : (salesCategoryId ? [salesCategoryId] : []),
        menuItemIds,
        discountPercentage,
        startDate,
        endDate,
        timeSchedules,
        isActive
      });
  
      await newRule.save();
  
      const { businessId, ...cleaned } = newRule.toObject({ flattenMaps: true });
      res.status(201).json(cleaned);
  
    } catch (err) {
      console.error('💥 Error creating PricingRule:', err);
      res.status(400).json({ error: 'Error creating pricing rule', details: err.message });
    }
  };

// Actualizar PricingRule
// Actualizar PricingRule
exports.update = async (req, res) => {
    try {
      const { id } = req.params;
      const authBusinessId = req.authUser.businessId;
      const { 
        value, 
        i18n, 
        salesCategoryId, 
        menuItemIds, 
        discountPercentage, 
        startDate, 
        endDate, 
        timeSchedules, 
        isActive 
      } = req.body;
  
      const pricingRule = await PricingRule.findOne({
        _id: id,
        businessId: authBusinessId
      });
  
      if (!pricingRule) {
        return res.status(404).json({ error: 'PricingRule not found for your business' });
      }
  
      // Validar si actualizan el value
      if (value && value.trim().toLowerCase() !== pricingRule.value) {
        const duplicate = await PricingRule.findOne({
          businessId: authBusinessId,
          value: value.trim().toLowerCase(),
          _id: { $ne: id }
        });
  
        if (duplicate) {
          return res.status(400).json({ error: 'Another PricingRule with the same value already exists' });
        }
  
        pricingRule.value = value.trim().toLowerCase();
      }
  
      // Validar SalesCategory si la actualizan
      if (salesCategoryId) {
        // Check if the current salesCategoryIds array exists and has an item to compare
        const currentCategoryId = pricingRule.salesCategoryIds && pricingRule.salesCategoryIds.length > 0 
          ? pricingRule.salesCategoryIds[0].toString()
          : null;
        
        // Only proceed if the ID is different or there was no previous ID
        if (!currentCategoryId || salesCategoryId.toString() !== currentCategoryId) {
          const categoryExists = await SalesCategoryTemplate.findOne({
            _id: salesCategoryId,
            businessId: authBusinessId
          });
  
          if (!categoryExists) {
            return res.status(400).json({ error: 'Sales category does not exist for your business' });
          }
  
          // Update to array format to match the schema
          pricingRule.salesCategoryIds = [salesCategoryId];
        }
      }
  
      // Validar MenuItems si los actualizan
      if (menuItemIds) {
        const menuItems = await MenuItemTemplate.find({
          _id: { $in: menuItemIds },
          businessId: authBusinessId
        }).select('_id salesCategoryId');
  
        if (menuItems.length !== menuItemIds.length) {
          return res.status(400).json({ error: 'One or more MenuItems do not exist for your business' });
        }
  
        // Get the category ID to check against - either from request or the first in the existing array
        const categoryToCheck = salesCategoryId || 
          (pricingRule.salesCategoryIds && pricingRule.salesCategoryIds.length > 0 
            ? pricingRule.salesCategoryIds[0] 
            : null);
        
        // Only validate menu items belong to category if we have a category
        if (categoryToCheck) {
          const invalidMenuItems = menuItems.filter(item => 
            item.salesCategoryId && item.salesCategoryId.toString() !== categoryToCheck.toString()
          );
  
          if (invalidMenuItems.length > 0) {
            return res.status(400).json({ error: 'One or more MenuItems do not belong to the selected SalesCategory' });
          }
        }
  
        pricingRule.menuItemIds = menuItemIds;
      }
  
      if (i18n !== undefined) pricingRule.i18n = i18n;
      if (discountPercentage !== undefined) pricingRule.discountPercentage = discountPercentage;
      if (startDate !== undefined) pricingRule.startDate = startDate;
      if (endDate !== undefined) pricingRule.endDate = endDate;
      if (timeSchedules !== undefined) pricingRule.timeSchedules = timeSchedules;
      if (isActive !== undefined) pricingRule.isActive = isActive;
  
      await pricingRule.save();
  
      const { businessId, ...cleaned } = pricingRule.toObject({ flattenMaps: true });
      res.json(cleaned);
  
    } catch (err) {
      console.error('💥 Error updating PricingRule:', err);
      res.status(400).json({ error: 'Error updating pricing rule', details: err.message });
    }
  };

// Obtener PricingRule por ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const authBusinessId = req.authUser.businessId;

    const rule = await PricingRule.findOne({
      _id: id,
      businessId: authBusinessId
    });

    if (!rule) {
      return res.status(404).json({ error: 'PricingRule not found for your business' });
    }

    const { businessId, ...cleaned } = rule.toObject({ flattenMaps: true });
    res.json(cleaned);

  } catch (err) {
    console.error('💥 Error retrieving PricingRule by ID:', err);
    res.status(400).json({ error: 'Error retrieving pricing rule', details: err.message });
  }
};

// Buscar PricingRules por filtros
exports.getAll = async (req, res) => {
  try {
    const filters = req.body.filters || [];
    const mongoFilters = utils.buildMongoFilters(filters);

    mongoFilters.businessId = req.authUser.businessId;

    const rules = await PricingRule.find(mongoFilters)
      .select('-businessId -__v')
      .lean();

    res.json(rules);

  } catch (err) {
    console.error('💥 Error retrieving PricingRules:', err);
    res.status(500).json({ error: err.message });
  }
};