const BranchUser = require('../models/BranchUser');

exports.createBranchUser = async (req, res) => {
  try {
    const user = new BranchUser(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getUsersByBranch = async (req, res) => {
  try {
    const { branchId } = req.params;
    const users = await BranchUser.find({ branchId });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};