const RestaurantBranch = require('../models/RestaurantBranch');
const utils = require('../utils/utils');

exports.createBranch = async (req, res) => {
  try {
    
    utils.validateBusinessAccess(req.body.businessId, req.authUser);
    console.log('[DEBUG schema]', RestaurantBranch.schema.path('location.address.state'));
    const branch = new RestaurantBranch(req.body);
    await branch.save();
    res.status(201).json(branch);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/*exports.getBranches = async (req, res) => {
  try {
    const rawBranches = await RestaurantBranch.find(
      { businessId: req.authUser.businessId },
      '_id name code isActive description contact location'
    ).lean(); // lean para obtener objetos planos

    const orderedBranches = rawBranches.map(branch => ({
      _id: branch._id,
      name: branch.name,
      code: branch.code,
      isActive: branch.isActive,
      description: branch.description,
      contact: branch.contact,
      location: branch.location
    }));

    res.json(orderedBranches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};*/

exports.getBranches = async (req, res) => {
  try {
    const filters = req.body.filters || [];
    const mongoFilters = utils.buildMongoFilters(filters);
    mongoFilters.businessId = req.authUser.businessId;

    const rawBranches = await RestaurantBranch.find(
      mongoFilters,
      '_id name code isActive description contact location'
    ).lean();

    const orderedBranches = rawBranches.map(branch => ({
      _id: branch._id,
      name: branch.name,
      code: branch.code,
      isActive: branch.isActive,
      description: branch.description,
      contact: branch.contact,
      location: branch.location
    }));

    res.json(orderedBranches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBranchById = async (req, res) => {
  try {

    //Validar que el usuario tenga acceso al BusinessID
    console.log('GS - Token:', req.authUser);
    

    const business = await RestaurantBranch.findById(req.params.id);
    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }
    
    utils.validateBusinessAccess(business.businessId, req.authUser);
    res.json(business);
  } catch (err) {
    
    res.status(err.status || 500).json({ error: err.message });
  }
};

exports.updateBranch = async (req, res) => {
  try {
    const branchId = req.params.id;
    const updates = req.body;

    // Buscamos el branch
    const branch = await RestaurantBranch.findById(branchId);
    if (!branch) {
      return res.status(404).json({ error: 'Sucursal no encontrada' });
    }

    // Validar que la sucursal pertenezca al business del usuario autenticado
    utils.validateBusinessAccess(branch.businessId, req.authUser);

    // Opcional: podés limitar qué campos se pueden actualizar
    const allowedFields = ['name', 'code', 'description', 'isActive', 'contact', 'location', 'openingHours'];
    const actualUpdates = {};

    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        actualUpdates[field] = updates[field];
      }
    });

    // Actualizamos
    const updatedBranch = await RestaurantBranch.findByIdAndUpdate(
      branchId,
      { $set: actualUpdates },
      { new: true } // para retornar la versión actualizada
    ).lean();

    res.json(updatedBranch);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

