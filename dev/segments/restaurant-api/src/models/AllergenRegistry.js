const mongoose = require('mongoose');
const { Schema } = mongoose;

const AllergenRegistrySchema = new Schema({
  businessId: {
    type: Schema.Types.ObjectId,
    ref: 'RestaurantBusiness', // Ajustado como en AttributeValue
    required: true
  },
  value: {
    type: String,
    required: true
    // Ej: "gluten" (clave técnica, no multilenguaje)
  },
  i18n: {
    type: Map,
    of: new Schema({
      label: { type: String },       // Ej: Gluten, Gluten-Free, etc.
      description: { type: String }  // Explicación opcional
    }),
    required: true
  },
  iconUrl: {
    type: String,
    required: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('AllergenRegistry', AllergenRegistrySchema);