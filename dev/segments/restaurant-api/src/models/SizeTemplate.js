const mongoose = require('mongoose');

const SizeTemplateSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'RestaurantBusiness', required: true },
  value: { type: String, required: true, unique: false }, // ejemplo: "small", "medium", "large"
  
  i18n: {
    type: Map,
    of: new mongoose.Schema({
      label: { type: String, required: true },
      description: { type: String }
    }),
    required: true
  },

  unit: { type: String }, // Ejemplo: "ml", "oz", "cm", etc.
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('SizeTemplate', SizeTemplateSchema);