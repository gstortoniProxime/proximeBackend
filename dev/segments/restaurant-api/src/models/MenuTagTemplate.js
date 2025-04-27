const mongoose = require('mongoose');

const MenuTagTemplateSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'RestaurantBusiness', required: true },
  
  value: { type: String, required: true, unique: false }, 
  // Ejemplo: "vegan", "gluten_free" (clave técnica interna)

  i18n: {
    type: Map,
    of: new mongoose.Schema({
      label: { type: String },
      description: { type: String }
    }),
    required: true
  },

  iconUrl: { type: String }, // URL para el ícono visual (ej: "https://...")
  
  colorHex: { type: String }, // Color asociado para los filtros (ej: "#2ecc71" para verde)
  
  isActive: { type: Boolean, default: true }

}, { timestamps: true });

module.exports = mongoose.model('MenuTagTemplate', MenuTagTemplateSchema);