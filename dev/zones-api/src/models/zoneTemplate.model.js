const mongoose = require('mongoose');

const ZoneTemplateSchema = new mongoose.Schema({
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
  parentTemplate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ZoneTemplate',
    default: null
  },
  children: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ZoneTemplate'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('ZoneTemplate', ZoneTemplateSchema);
