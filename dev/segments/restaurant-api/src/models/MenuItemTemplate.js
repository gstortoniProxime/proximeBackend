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

  value: { 
    type: String, 
    required: true, 
    unique: false,
    validate: {
      validator: function(v) {
        return /^[a-z0-9-]+$/.test(v);
      },
      message: props => `${props.value} no es un formato válido para value. Use solo minúsculas, números y guiones.`
    }
  },

  i18n: {
    type: Map,
    of: new Schema({
      label: { type: String },
      description: { type: String }
    }),
    required: true
  },

  salesCategoryId: { type: Schema.Types.ObjectId, ref: 'SalesCategoryTemplate', required: true },
  
  // Cambio: Reemplazamos menuGroupId con menuGroups para permitir múltiples grupos
  menuGroups: [{
    groupId: { type: Schema.Types.ObjectId, ref: 'MenuGroupTemplate', required: true },
    isPrimary: { type: Boolean, default: false },
    order: { type: Number, default: 0 }
  }],

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

// Validar que haya al menos un grupo de menú
MenuItemTemplateSchema.path('menuGroups').validate(function(value) {
  return value.length > 0;
}, 'Al menos un grupo de menú es requerido');

// Validar que haya exactamente un grupo primario
MenuItemTemplateSchema.pre('save', function(next) {
  if (this.menuGroups && this.menuGroups.length > 0) {
    const primaryCount = this.menuGroups.filter(g => g.isPrimary).length;
    
    if (primaryCount === 0) {
      // Si no hay ninguno marcado como primario, marcar el primero
      this.menuGroups[0].isPrimary = true;
    } else if (primaryCount > 1) {
      return next(new Error('Solo puede haber un grupo primario'));
    }
  }
  next();
});

// Índices para mejorar el rendimiento
MenuItemTemplateSchema.index({ businessId: 1, 'menuGroups.groupId': 1 });
MenuItemTemplateSchema.index({ businessId: 1, isActive: 1 });
MenuItemTemplateSchema.index({ businessId: 1, value: 1 }, { unique: true });

module.exports = mongoose.model('MenuItemTemplate', MenuItemTemplateSchema);