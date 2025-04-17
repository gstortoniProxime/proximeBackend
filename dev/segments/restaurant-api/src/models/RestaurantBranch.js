const mongoose = require('mongoose');

const restaurantBranchSchema = new mongoose.Schema({
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RestaurantBusiness',
    required: true
  },
  name: { type: String, required: true },
  description: { type: String },
  phone: { type: String },
  email: { type: String },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true // [longitude, latitude]
    }
  },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  zipCode: { type: String },
  country: { type: String },
  timezone: { type: String },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

restaurantBranchSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('RestaurantBranch', restaurantBranchSchema);
