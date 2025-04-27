const MenuTemplate = require('../../models/MenuTemplate');
const MenuTypeTemplate = require('../../models/MenuTypeTemplate');
const utils = require('../../utils/utils');

// Crear nuevo MenuTemplate

exports.create = async (req, res) => {
    try {
      const authBusinessId = req.authUser.businessId;
      const { value, i18n, menuTypeIds, isActive, startDate, endDate, timeSchedules, availableBranches } = req.body;
  
      // Validar que todos los menuTypeIds existan
      const existingMenuTypes = await MenuTypeTemplate.find({ _id: { $in: menuTypeIds } }).select('_id');
  
      if (existingMenuTypes.length !== menuTypeIds.length) {
        return res.status(400).json({
          error: 'One or more provided menuTypeIds do not exist'
        });
      }
      const duplicate = await MenuTemplate.findOne({
        businessId: authBusinessId,
        value
      });
      
      if (duplicate) {
        return res.status(400).json({ error: 'Another MenuTemplate with this value already exists' });
      }
      const newMenuTemplate = new MenuTemplate({
        businessId: authBusinessId,
        value,
        i18n,
        menuTypeIds,
        isActive,
        startDate,
        endDate,
        timeSchedules,
        availableBranches
      });
  
      await newMenuTemplate.save();
  
      const { businessId, ...cleaned } = newMenuTemplate.toObject();
      res.status(201).json(cleaned);
  
    } catch (err) {
      console.error('💥 Error creating menu template:', err);
      res.status(400).json({ error: 'Error creating menu template', details: err.message });
    }
  };

// Actualizar MenuTemplate
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const authBusinessId = req.authUser.businessId;

    const { value, i18n, menuTypeIds, isActive, startDate, endDate, timeSchedules, availableBranches } = req.body;

    const menuTemplate = await MenuTemplate.findOne({
      _id: id,
      businessId: authBusinessId
    });

    if (!menuTemplate) {
      return res.status(404).json({ error: 'MenuTemplate not found for your business' });
    }

    // Si quieren actualizar "value", validar que no haya duplicados
    if (value && value !== menuTemplate.value) {
      const duplicate = await MenuTemplate.findOne({
        businessId: authBusinessId,
        value
      });

      if (duplicate) {
        return res.status(400).json({ error: 'Another MenuTemplate with this value already exists' });
      }
    }
    if (menuTypeIds) {
        const existingMenuTypes = await MenuTypeTemplate.find({ _id: { $in: menuTypeIds } }).select('_id');
      
        if (existingMenuTypes.length !== menuTypeIds.length) {
          return res.status(400).json({
            error: 'One or more provided menuTypeIds do not exist'
          });
        }
      }
    menuTemplate.value = value ?? menuTemplate.value;
    menuTemplate.i18n = i18n ?? menuTemplate.i18n;
    menuTemplate.menuTypeIds = menuTypeIds ?? menuTemplate.menuTypeIds;
    menuTemplate.isActive = isActive ?? menuTemplate.isActive;
    menuTemplate.startDate = startDate ?? menuTemplate.startDate;
    menuTemplate.endDate = endDate ?? menuTemplate.endDate;
    menuTemplate.timeSchedules = timeSchedules ?? menuTemplate.timeSchedules;
    menuTemplate.availableBranches = availableBranches ?? menuTemplate.availableBranches;

    await menuTemplate.save();

    const { businessId, ...cleaned } = menuTemplate.toObject({ flattenMaps: true });
    res.json(cleaned);

  } catch (err) {
    console.error('💥 Error in menuTemplate update:', err);
    res.status(400).json({ error: 'Error updating menu template', details: err.message });
  }
};

// Obtener MenuTemplate por ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const authBusinessId = req.authUser.businessId;

    const menuTemplate = await MenuTemplate.findOne({
      _id: id,
      businessId: authBusinessId
    });

    if (!menuTemplate) {
      return res.status(404).json({ error: 'MenuTemplate not found for your business' });
    }

    const { businessId, ...cleaned } = menuTemplate.toObject({ flattenMaps: true });
    res.json(cleaned);

  } catch (err) {
    console.error('💥 Error in menuTemplate getById:', err);
    res.status(400).json({ error: 'Error retrieving menu template', details: err.message });
  }
};

// Buscar MenuTemplates por filtros
exports.getMenuTemplates = async (req, res) => {
  try {
    const filters = req.body.filters || [];
    const mongoFilters = utils.buildMongoFilters(filters);

    mongoFilters.businessId = req.authUser.businessId;

    const menuTemplates = await MenuTemplate.find(mongoFilters)
      .select('-businessId -__v')
      .lean();

    res.json(menuTemplates);

  } catch (err) {
    console.error('💥 Error in menuTemplate getMenuTemplates:', err);
    res.status(500).json({ error: err.message });
  }
};