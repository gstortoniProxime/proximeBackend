const mongoose = require('mongoose');

const TimeScheduleSchema = new mongoose.Schema({
  day: { 
    type: String, 
    required: true, 
    enum: [
      'sunday', 'monday', 'tuesday', 'wednesday', 
      'thursday', 'friday', 'saturday'
    ]
  },
  startTime: { type: String, required: true }, // "HH:MM"
  endTime: { type: String, required: true }
}, { _id: false });

const PricingRuleSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'RestaurantBusiness', required: true },

  value: { type: String, required: true }, // Clave técnica única dentro del negocio
  i18n: {
    type: Map,
    of: new mongoose.Schema({
      label: { type: String },
      description: { type: String }
    }),
    required: true
  },

  salesCategoryIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SalesCategoryTemplate' }], // Categorías de productos afectadas
  menuItemIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MenuItemTemplate' }], // Productos específicos afectados

  discountPercentage: { type: Number, min: 0, max: 100 }, // % de descuento sobre precio base
  
  startDate: { type: Date }, // Desde qué día aplica
  endDate: { type: Date },   // Hasta qué día aplica

  timeSchedules: [TimeScheduleSchema], // Horarios por día

  isActive: { type: Boolean, default: true }
  
}, { timestamps: true });

module.exports = mongoose.model('PricingRule', PricingRuleSchema);