const mongoose = require('mongoose');
const { Schema } = mongoose;

const NutritionalInfoSchema = new Schema({
  calories: { type: Number },
  fat: { type: Number },
  carbs: { type: Number },
  protein: { type: Number }
}, { _id: false });

const MediaItemSchema = new Schema({
  url: { type: String, required: true },
  type: { type: String, enum: ['image', 'video'], required: true },
  order: { type: Number, required: true }
}, { _id: false });

const MenuItemTemplateSchema = new Schema({
  businessId: { type: Schema.Types.ObjectId, ref: 'RestaurantBusiness', required: true },

  value: { type: String, required: true, unique: false },

  i18n: {
    type: Map,
    of: new Schema({
      label: { type: String },
      description: { type: String }
    }),
    required: true
  },

  salesCategoryId: { type: Schema.Types.ObjectId, ref: 'SalesCategoryTemplate', required: true },
  menuGroupId: { type: Schema.Types.ObjectId, ref: 'MenuGroupTemplate', required: true },

  isActive: { type: Boolean, default: true },

  price: { type: Number, required: true },

  pricingRuleId: { type: Schema.Types.ObjectId, ref: 'PricingRuleTemplate' },

  modifiers: [
    {
      modifierGroupId: { type: Schema.Types.ObjectId, ref: 'ModifierGroupTemplate' },
      isRequired: { type: Boolean, default: false }
    }
  ],

  portions: [
    {
      portionId: { type: Schema.Types.ObjectId, ref: 'PortionTemplate' },
      priceDelta: { type: Number }
    }
  ],

  nutritionalInfo: NutritionalInfoSchema,

  allergenIds: [{ type: Schema.Types.ObjectId, ref: 'AllergenRegistryTemplate' }],
  dietaryTagIds: [{ type: Schema.Types.ObjectId, ref: 'MenuTagTemplate' }],

  imageUrl: { type: String },
  colorHex: { type: String },

  // 🎥🖼️ Carrusel multimedia
  mediaGallery: [MediaItemSchema]

}, { timestamps: true });

module.exports = mongoose.model('MenuItemTemplate', MenuItemTemplateSchema);