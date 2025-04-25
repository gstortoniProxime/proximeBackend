const mongoose = require('mongoose');

const AttributeValueSchema = new mongoose.Schema({
  attributeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Attribute', required: true },
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'RestaurantBusiness', required: true },
  value: { type: String, required: true }, // clave técnica: "medium"
  
  i18n: {
    type: Map,
    of: new mongoose.Schema({
      label: { type: String },
      description: { type: String }
    }),
    required: true
  },

  emoji: { type: String },
  imageUrl: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('AttributeValue', AttributeValueSchema);