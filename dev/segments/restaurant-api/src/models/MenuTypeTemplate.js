const mongoose = require('mongoose');

const MenuTypeTemplateSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'RestaurantBusiness', required: true },

  value: { type: String, required: true, unique: true }, // clave técnica única para el negocio

  i18n: {
    type: Map,
    of: new mongoose.Schema({
      label: { type: String },
      description: { type: String }
    }),
    required: true
  },

  isActive: { type: Boolean, default: true }
  
}, { timestamps: true });

module.exports = mongoose.model('MenuTypeTemplate', MenuTypeTemplateSchema);