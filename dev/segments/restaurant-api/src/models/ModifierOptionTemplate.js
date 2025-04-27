const mongoose = require('mongoose');

const ModifierOptionTemplateSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'RestaurantBusiness', required: true },

  value: { type: String, required: true }, // Clave técnica, ej: "extra_cheese"

  i18n: {
    type: Map,
    of: new mongoose.Schema({
      label: { type: String },
      description: { type: String }
    }),
    required: true
  },

  price: { type: Number, default: 0 },  // Precio adicional (opcional)
  calories: { type: Number },            // Calorías adicionales (opcional)
  emoji: { type: String },               // Emoji opcional para UX
  imageUrl: { type: String },             // Imagen opcional

  defaultQuantity: { type: Number, default: 0 }, // Cantidad por defecto
  minQuantity: { type: Number, default: 0 },     // Mínimo permitible
  maxQuantity: { type: Number },                 // Máximo permitible

  isActive: { type: Boolean, default: true }     // Activo o no
}, { timestamps: true });

module.exports = mongoose.model('ModifierOptionTemplate', ModifierOptionTemplateSchema);