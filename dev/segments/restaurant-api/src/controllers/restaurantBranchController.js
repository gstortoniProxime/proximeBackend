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

exports.getBranches = async (req, res) => {
  try {
    const branches = await RestaurantBranch.find();
    res.json(branches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBranchById = async (req, res) => {
  try {
    const branches = await RestaurantBranch.find();
    res.json(branches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updateBranch = async (req, res) => {
  
};

