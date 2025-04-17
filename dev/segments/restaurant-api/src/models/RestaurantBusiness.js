const mongoose = require('mongoose');

const restaurantBusinessSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logoUrl: { type: String },
  description: { type: String },
  website: { type: String },
  representativeName: { type: String, required: true },
  representativeEmail: { type: String, required: true },
  representativePhone: { type: String },
  country: { type: String, required: true },
  state: { type: String },
  city: { type: String },
  address: { type: String },
  zipCode: { type: String },
  timezone: { type: String },
  language: { type: String, default: 'en' },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true
});

module.exports = mongoose.model('RestaurantBusiness', restaurantBusinessSchema);
