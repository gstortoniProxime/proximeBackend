const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const branchUserSchema = new mongoose.Schema({
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RestaurantBranch',
    required: true
  },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['waiter', 'supervisor', 'kitchen', 'cashier', 'manager'],
    required: true
  },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// 🔒 Middleware para hashear password antes de guardar
branchUserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // solo si es nuevo o modificado
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('BranchUser', branchUserSchema);