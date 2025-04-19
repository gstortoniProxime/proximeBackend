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
      street: String,
      number: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
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
      day: {
        type: String,
        enum: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
      },
      open: String, // "09:00"
      close: String // "18:00"
    }
  ],
  config: {
    acceptsReservations: {
      type: Boolean,
      default: false
    },
    acceptsDelivery: {
      type: Boolean,
      default: false
    },
    acceptsWalkIn: {
      type: Boolean,
      default: true
    },
    acceptsPickup: {
      type: Boolean,
      default: false
    }
  },
  metadata: {
    tags: [String],
    notes: String
  }
}, {
  timestamps: true
});

branchSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Branch', branchSchema);
