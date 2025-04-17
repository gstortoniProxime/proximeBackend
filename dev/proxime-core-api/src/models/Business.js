const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  name: { type: String, required: true },
  segmentType: { type: String, required: true },
  country: { type: String, required: true },
  language: { type: String, required: true },
  timezone: { type: String, required: true },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true
});

module.exports = mongoose.model('Business', businessSchema);
