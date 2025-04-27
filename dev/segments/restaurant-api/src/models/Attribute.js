const mongoose = require('mongoose');

const AttributeSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'RestaurantBusiness', default: null }, // null = global Proxime
  name: { type: String, required: true},
  //key: { type: String, required: true, unique: true },
  type: { type: String, enum: ['enum', 'string', 'number', 'boolean', 'multiselect'], required: true },
  required: { type: Boolean, default: false },
  isClientSelectable: { type: Boolean, default: false },
  isCustomizable: { type: Boolean, default: true },
  defaultValue: { type: mongoose.Schema.Types.Mixed },
  description: { type: String },
  unit: { type: String },
  minValue: { type: Number },
  maxValue: { type: Number },
  step: { type: Number },
  displayOrder: { type: Number, default: 0 },
  group: { type: String },
  showInKitchen: { type: Boolean, default: false },
  visibleInMenus: { type: Boolean, default: true },
  dependsOnAttributeKey: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Attribute', AttributeSchema);