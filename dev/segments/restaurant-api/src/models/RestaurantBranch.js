const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RestaurantBusiness',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    unique: true,
    sparse: true,
    uppercase: true
  },
  description: {
    type: String
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [lng, lat]
      required: true
    },
    address: {
      street: { type: String, required: true },
      number: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: false }, 
      region: { type: String, required: false }, 
      zipCode: { type: String, required: false }, 
      country: { type: String, required: true }
    }
  },
  contact: {
    phone: String,
    email: String,
    whatsapp: String,
    contactPerson: String
  },
  timezone: {
    type: String,
    default: 'America/New_York'
  },
  language: {
    type: String,
    default: 'en'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  openingHours: [
    {
      _id: false, 
      day: {
        type: String,
        enum: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
      },
      open: String,
      close: String
    }
  ],
  enabledModules: {
    type: [mongoose.Schema.Types.ObjectId], // Ej: ['reservations', 'delivery', 'attention']
    default: []
  },
  metadata: {
    tags: [String],
    notes: String
  }
}, {
  timestamps: true
});

branchSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('restaurantBranch', branchSchema);