const mongoose = require('mongoose');

const TimeScheduleSchema = new mongoose.Schema({
  day: { 
    type: String, 
    required: true, 
    enum: [
      'sunday', 'monday', 'tuesday', 'wednesday', 
      'thursday', 'friday', 'saturday'
    ]
  }, // día en texto
  startTime: { type: String, required: true }, // "HH:MM"
  endTime: { type: String, required: true }
}, { _id: false });

const MenuTemplateSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'RestaurantBusiness', required: true },

  value: { type: String, required: true, unique: false },

  i18n: {
    type: Map,
    of: new mongoose.Schema({
      label: { type: String },
      description: { type: String }
    }),
    required: true
  },

  menuTypeIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MenuTypeTemplate', required: true }],

  isActive: { type: Boolean, default: true },

  startDate: { type: Date },
  endDate: { type: Date },

  timeSchedules: [TimeScheduleSchema],

  availableBranches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RestaurantBranch' }]

}, { timestamps: true });

module.exports = mongoose.model('MenuTemplate', MenuTemplateSchema);