const mongoose = require('mongoose');
const { Schema } = mongoose;

const MenuGroupTemplateSchema = new Schema({
  businessId: {
    type: Schema.Types.ObjectId,
    ref: 'RestaurantBusiness',
    required: true
  },

  value: {
    type: String,
    required: true,
    unique: false
  },

  i18n: {
    type: Map,
    of: new Schema({
      label: { type: String },
      description: { type: String }
    }),
    required: true
  },

  // Campo para definir el padre de este grupo (null si es un grupo raíz)
  parentId: {
    type: Schema.Types.ObjectId,
    ref: 'MenuGroupTemplate',
    default: null
  },

  // Campo que indica si este grupo es un grupo raíz o un subgrupo
  isRoot: {
    type: Boolean,
    default: true
  },

  // Nivel de profundidad en la jerarquía (0 para raíces, 1 para hijos directos, etc.)
  level: {
    type: Number,
    default: 0
  },

  // Path completo en la jerarquía para búsquedas más eficientes
  path: {
    type: String,
    default: ''
  },

  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Índices para mejorar el rendimiento de las búsquedas jerárquicas
MenuGroupTemplateSchema.index({ businessId: 1, parentId: 1 });
MenuGroupTemplateSchema.index({ path: 1 });

module.exports = mongoose.model('MenuGroupTemplate', MenuGroupTemplateSchema);