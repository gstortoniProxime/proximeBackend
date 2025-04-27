const mongoose = require('mongoose');

const ModifierGroupTemplateSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'RestaurantBusiness', required: true },

  value: { type: String, required: true }, // clave técnica interna, ej: "pizza_toppings"

  i18n: {
    type: Map,
    of: new mongoose.Schema({
      label: { type: String },
      description: { type: String }
    }),
    required: true
  },

  minSelections: { type: Number, default: 0 }, // mínimo de seleccionables
  maxSelections: { type: Number, required: true }, // máximo de seleccionables

  isRequired: { type: Boolean, default: false }, // si es obligatorio seleccionar al menos uno
  enablePortions: { type: Boolean, default: false }, // si permite aplicar por porciones (mitades, etc)

  modifiers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ModifierOptionTemplate' }], // lista de modifiers válidos en este grupo

  isActive: { type: Boolean, default: true }

}, { timestamps: true });

module.exports = mongoose.model('ModifierGroupTemplate', ModifierGroupTemplateSchema);