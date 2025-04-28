const mongoose = require('mongoose');
const { Schema } = mongoose;

const MenuGroupTemplateSchema = new Schema({
  businessId: {
    type: Schema.Types.ObjectId,
    ref: 'RestaurantBusiness',
    required: true
  },

  value: {
    type: String,
    required: true,
    unique: false // ⚡ El valor debe ser único por business, no global
  },

  i18n: {
    type: Map,
    of: new Schema({
      label: { type: String },
      description: { type: String }
    }),
    required: true
  },

  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('MenuGroupTemplate', MenuGroupTemplateSchema);