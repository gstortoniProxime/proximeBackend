const mongoose = require('mongoose');

const ZoneSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ['area', 'table', 'seat', 'custom'],
    required: true
  },
  attributes: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },
  parentZone: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Zone',
    default: null
  },
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  children: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Zone'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Zone', ZoneSchema);
