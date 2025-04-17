const RestaurantBusiness = require('../models/RestaurantBusiness');

exports.createBusiness = async (req, res) => {
  try {
    const business = new RestaurantBusiness(req.body);
    await business.save();
    res.status(201).json(business);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getBusinesses = async (req, res) => {
  try {
    const businesses = await RestaurantBusiness.find({
      _id: req.auth.businessId // <-- solo devuelve la empresa del token
    });
    res.json(businesses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};