const mongoose = require('mongoose');
const { Schema } = mongoose;

const SalesCategoryTemplateSchema = new Schema({
  businessId: {
    type: Schema.Types.ObjectId,
    ref: 'RestaurantBusiness',
    required: true
  },
  value: {
    type: String,
    required: true,
    unique: false // ⚡ Uniqueness la manejamos a nivel business, no global
    // Ej: "beverages", "snacks", "alcohol"
  },
  i18n: {
    type: Map,
    of: new Schema({
      label: { type: String },       // Nombre de la categoría en ese idioma
      description: { type: String }  // Descripción opcional de para qué se usa
    }),
    required: true
  },
  iconUrl: {
    type: String,
    required: false
    // Ícono que puede usarse para visualización en POS o dashboard
  },
  colorHex: {
    type: String,
    required: false
    // Ej: "#FF5733" para representar la categoría en visualizaciones gráficas
  },
  isDefault: {
    type: Boolean,
    default: false
    // Indica si esta categoría es una plantilla "base" creada por Proxime
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('SalesCategoryTemplate', SalesCategoryTemplateSchema);