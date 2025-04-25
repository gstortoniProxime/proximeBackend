const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaxRateRegistrySchema = new Schema({
  businessId: {
    type: Schema.Types.ObjectId,
    ref: 'RestaurantBusiness',
    required: true
  },
  country: { type: String, required: true },
  state: { type: String, required: true },
  county: { type: String, default: null }, // Nuevo campo
  city: { type: String, default: null },
  name: { type: String, required: true },
  rate: { type: Number, required: true, min: 0, max: 1 },
  appliesTo: {
    type: [String],
    default: ['all']
  },
  isDefault: { type: Boolean, default: false }
}, {
  timestamps: true
});

module.exports = mongoose.model('TaxRateRegistry', TaxRateRegistrySchema);