const RestaurantBranch = require('../models/RestaurantBranch');

exports.createBranch = async (req, res) => {
  try {
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
