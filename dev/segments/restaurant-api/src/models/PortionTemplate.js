const mongoose = require('mongoose');

const PortionTemplateSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'RestaurantBusiness', required: true },

  value: { type: String, required: true }, // clave técnica: "half_left", "whole", etc

  i18n: {
    type: Map,
    of: new mongoose.Schema({
      label: { type: String },
      description: { type: String }
    }),
    required: true
  },

  displayOrder: { type: Number, required: true }, // para ordenar las porciones en el Frontend

  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('PortionTemplate', PortionTemplateSchema);