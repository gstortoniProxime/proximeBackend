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
      menuGroups, // Ahora es un array de objetos
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

    // Validar requisitos básicos
    if (!menuGroups || !Array.isArray(menuGroups) || menuGroups.length === 0) {
      return res.status(400).json({ 
        error: 'At least one menu group is required' 
      });
    }

    // Validaciones principales
    const salesCategory = await SalesCategoryTemplate.findById(salesCategoryId);
    
    if (!salesCategory) {
      return res.status(400).json({ error: 'SalesCategoryTemplate not found' });
    }

    // Validar que los grupos existan y pertenezcan al negocio
    const groupIds = menuGroups.map(group => group.groupId);
    const foundGroups = await MenuGroupTemplate.find({ 
      _id: { $in: groupIds },
      businessId: authBusinessId
    }).select('_id');

    if (foundGroups.length !== groupIds.length) {
      return res.status(400).json({ 
        error: 'One or more MenuGroupTemplate IDs do not exist or do not belong to your business' 
      });
    }

    // Asegurarse de que haya exactamente un grupo primario
    const primaryCount = menuGroups.filter(g => g.isPrimary).length;
    if (primaryCount === 0) {
      // Si no hay ninguno marcado como primario, marcar el primero
      menuGroups[0].isPrimary = true;
    } else if (primaryCount > 1) {
      return res.status(400).json({
        error: "Only one menu group can be set as primary"
      });
    }

    // Validar modificadores
    if (modifiers && modifiers.length > 0) {
      const modifierIds = modifiers.map(m => m.modifierGroupId);
      const foundModifiers = await ModifierGroupTemplate.find({ 
        _id: { $in: modifierIds },
        businessId: authBusinessId 
      }).select('_id');
      
      if (foundModifiers.length !== modifierIds.length) {
        return res.status(400).json({ error: 'One or more ModifierGroupTemplate IDs do not exist' });
      }
    }

    // Validar porciones
    if (portions && portions.length > 0) {
      const portionIds = portions.map(p => p.portionId);
      const foundPortions = await PortionTemplate.find({ 
        _id: { $in: portionIds },
        businessId: authBusinessId 
      }).select('_id');
      
      if (foundPortions.length !== portionIds.length) {
        return res.status(400).json({ error: 'One or more PortionTemplate IDs do not exist' });
      }
    }

    // Validar alérgenos
    if (allergenIds && allergenIds.length > 0) {
      const foundAllergens = await AllergenRegistry.find({ _id: { $in: allergenIds } }).select('_id');
      if (foundAllergens.length !== allergenIds.length) {
        return res.status(400).json({ error: 'One or more Allergen IDs do not exist' });
      }
    }

    // Validar etiquetas dietéticas
    if (dietaryTagIds && dietaryTagIds.length > 0) {
      const foundDietaryTags = await MenuTagTemplate.find({ 
        _id: { $in: dietaryTagIds },
        businessId: authBusinessId 
      }).select('_id');
      
      if (foundDietaryTags.length !== dietaryTagIds.length) {
        return res.status(400).json({ error: 'One or more Dietary Tag IDs do not exist' });
      }
    }

    // Validar que no exista el mismo value para este negocio
    const existingItem = await MenuItemTemplate.findOne({
      businessId: authBusinessId,
      value: value.trim().toLowerCase()
    });

    if (existingItem) {
      return res.status(400).json({
        error: `Menu item with value "${value}" already exists for your business`
      });
    }

    const newItem = new MenuItemTemplate({
      businessId: authBusinessId,
      value: value.trim().toLowerCase(),
      i18n,
      salesCategoryId,
      menuGroups, // Ahora es un array de objetos
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
      menuGroups, // Ahora es un array de objetos
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

    // Validar categoría de ventas
    if (salesCategoryId) {
      const salesCategory = await SalesCategoryTemplate.findById(salesCategoryId);
      if (!salesCategory) {
        return res.status(400).json({ error: 'SalesCategoryTemplate not found' });
      }
    }

    // Validar grupos de menú
    if (menuGroups) {
      if (!Array.isArray(menuGroups) || menuGroups.length === 0) {
        return res.status(400).json({ 
          error: 'At least one menu group is required' 
        });
      }

      const groupIds = menuGroups.map(group => group.groupId);
      const foundGroups = await MenuGroupTemplate.find({ 
        _id: { $in: groupIds },
        businessId: authBusinessId
      }).select('_id');

      if (foundGroups.length !== groupIds.length) {
        return res.status(400).json({ 
          error: 'One or more MenuGroupTemplate IDs do not exist or do not belong to your business' 
        });
      }

      // Asegurarse de que haya exactamente un grupo primario
      const primaryCount = menuGroups.filter(g => g.isPrimary).length;
      if (primaryCount === 0) {
        // Si no hay ninguno marcado como primario, marcar el primero
        menuGroups[0].isPrimary = true;
      } else if (primaryCount > 1) {
        return res.status(400).json({
          error: "Only one menu group can be set as primary"
        });
      }
    }

    // Validar modificadores
    if (modifiers && modifiers.length > 0) {
      const modifierIds = modifiers.map(m => m.modifierGroupId);
      const foundModifiers = await ModifierGroupTemplate.find({ 
        _id: { $in: modifierIds },
        businessId: authBusinessId 
      }).select('_id');
      
      if (foundModifiers.length !== modifierIds.length) {
        return res.status(400).json({ error: 'One or more ModifierGroupTemplate IDs do not exist' });
      }
    }

    // Validar porciones
    if (portions && portions.length > 0) {
      const portionIds = portions.map(p => p.portionId);
      const foundPortions = await PortionTemplate.find({ 
        _id: { $in: portionIds },
        businessId: authBusinessId 
      }).select('_id');
      
      if (foundPortions.length !== portionIds.length) {
        return res.status(400).json({ error: 'One or more PortionTemplate IDs do not exist' });
      }
    }

    // Validar alérgenos
    if (allergenIds && allergenIds.length > 0) {
      const foundAllergens = await AllergenRegistry.find({ _id: { $in: allergenIds } }).select('_id');
      if (foundAllergens.length !== allergenIds.length) {
        return res.status(400).json({ error: 'One or more Allergen IDs do not exist' });
      }
    }

    // Validar etiquetas dietéticas
    if (dietaryTagIds && dietaryTagIds.length > 0) {
      const foundDietaryTags = await MenuTagTemplate.find({ 
        _id: { $in: dietaryTagIds },
        businessId: authBusinessId 
      }).select('_id');
      
      if (foundDietaryTags.length !== dietaryTagIds.length) {
        return res.status(400).json({ error: 'One or more Dietary Tag IDs do not exist' });
      }
    }

    // Validar si es un cambio de value
    if (value && value.trim().toLowerCase() !== item.value) {
      const normalizedValue = value.trim().toLowerCase();
      
      // Verificar que no exista otro ítem con el mismo value
      const duplicate = await MenuItemTemplate.findOne({
        businessId: authBusinessId,
        value: normalizedValue,
        _id: { $ne: id }
      });

      if (duplicate) {
        return res.status(400).json({
          error: `Another menu item with value "${value}" already exists`
        });
      }
      
      item.value = normalizedValue;
    }

    // Actualizar campos permitidos
    const allowedFields = [
      'i18n', 'salesCategoryId', 'menuGroups',
      'isActive', 'price', 'pricingRuleId', 'modifiers',
      'portions', 'allergenIds', 'dietaryTagIds',
      'nutritionalInfo', 'imageUrl', 'colorHex', 'mediaGallery'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined && field !== 'value') {
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
    })
    .populate('menuGroups.groupId', 'value i18n')
    .populate('salesCategoryId', 'value i18n')
    .populate('modifiers.modifierGroupId', 'value i18n')
    .populate('portions.portionId', 'value i18n')
    .populate('allergenIds', 'value i18n')
    .populate('dietaryTagIds', 'value i18n');

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
    const populate = req.body.populate || false;

    mongoFilters.businessId = req.authUser.businessId;

    let query = MenuItemTemplate.find(mongoFilters).select('-businessId -__v');
    
    // Opcionalmente poblar las referencias si se solicita
    if (populate) {
      query = query
        .populate('menuGroups.groupId', 'value i18n')
        .populate('salesCategoryId', 'value i18n')
        .populate('modifiers.modifierGroupId', 'value i18n')
        .populate('portions.portionId', 'value i18n')
        .populate('allergenIds', 'value i18n')
        .populate('dietaryTagIds', 'value i18n');
    }

    const items = await query.lean();

    res.json(items);

  } catch (err) {
    console.error('💥 Error retrieving MenuItemTemplates:', err);
    res.status(500).json({ error: err.message });
  }
};

// Nuevo método: Obtener ítems por grupo de menú
const { Types } = require('mongoose'); // Esto al principio del archivo

exports.getByMenuGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const authBusinessId = req.authUser.businessId;
    
    // Verificar que el grupo existe
    const menuGroup = await MenuGroupTemplate.findOne({
      _id: groupId,
      businessId: authBusinessId
    });
    
    if (!menuGroup) {
      return res.status(404).json({ error: 'Menu group not found for your business' });
    }
    
    // Imprimir ejemplo
    const sampleItem = await MenuItemTemplate.findOne({
      businessId: authBusinessId
    }).lean();
    
    if (sampleItem && sampleItem.menuGroups) {
      console.log('⚡ Ejemplo de menuGroups en un ítem:', 
        sampleItem.menuGroups.map(g => ({ 
          id: g.groupId.toString(), 
          isPrimary: g.isPrimary 
        }))
      );
      console.log('⚡ Buscando groupId:', groupId);
      console.log('⚡ ¿Coincide con alguno?', 
        sampleItem.menuGroups.some(g => g.groupId.toString() === groupId)
      );
    }
    
    const items = await MenuItemTemplate.find({
      businessId: authBusinessId,
      menuGroups: { 
        $elemMatch: { 
          groupId: new Types.ObjectId(groupId) 
        }
      }
    })
    //.populate('menuGroups.groupId', 'value i18n')
    //.populate('salesCategoryId', 'value i18n')
    .select('_id value i18n')
    .lean();
    
    console.log(`⚡ Ítems encontrados para el grupo ${groupId}:`, items.length);
    
    res.json(items);
    
  } catch (err) {
    console.error('💥 Error retrieving menu items by group:', err);
    res.status(400).json({ error: 'Error retrieving menu items', details: err.message });
  }
};