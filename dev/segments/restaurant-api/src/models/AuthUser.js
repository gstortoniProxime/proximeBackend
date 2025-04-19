const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const authUserSchema = new mongoose.Schema({
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RestaurantBusiness',
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'integration', 'developer'],
    default: 'admin',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  name: {
    type: String,
    trim: true,
  },
  branches: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Branch'
    }
  ]
}, {
  timestamps: true
});

authUserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

authUserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('AuthUser', authUserSchema);
