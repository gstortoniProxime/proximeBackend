const RestaurantBusiness = require('../models/RestaurantBusiness');

exports.createBusiness = async (req, res) => {
  try {
    const {
      name,
      website,
      representativeEmail
    } = req.body;

    // 🔍 Verificar si ya existe por nombre, sitio web o email del representante
    const existing = await RestaurantBusiness.findOne({
      $or: [
        { name },
        { website },
        { representativeEmail }
      ]
    });

    if (existing) {
      return res.status(409).json({
        error: 'Ya existe un negocio con el mismo nombre, sitio web o email del representante.'
      });
    }
    const business = new RestaurantBusiness(req.body);
    await business.save();
    res.status(201).json(business);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getBusinesses = async (req, res) => {
  
    try {
      const businessId = req?.auth?.businessId || req.params.id; // fallback si estás pasando el ID en la ruta
      const businesses = await RestaurantBusiness.find( );
      res.json({
        businessId: businessId,
        businesses: businesses
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};

exports.getBusinessesById = async (req, res) => {
  try {
    const business = await RestaurantBusiness.findById(req.params.id);
    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }
    res.json(business);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};