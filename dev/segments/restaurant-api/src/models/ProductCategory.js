const mongoose = require('mongoose');

const ProductCategorySchema = new mongoose.Schema({
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RestaurantBusiness',
    default: null // null = categoría global compartida por todos
  },

  // Nombre técnico interno (editable)
  name: { type: String, required: true },

  // Multilenguaje
  i18n: {
    en: {
      label: { type: String, required: true },
      description: { type: String }
    },
    es: {
      label: { type: String, required: true },
      description: { type: String }
    },
    ja: {
      label: { type: String },
      description: { type: String }
    }
    // ...otros idiomas según soporte
  },

  // Relación padre-hijo para estructura jerárquica
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductCategory',
    default: null
  },

  // Atributos aplicables a los productos de esta categoría
  attributes: [
    {
      attributeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Attribute'
      },
      required: { type: Boolean, default: false }, // ¿obligatorio en producto?
      visibleInUI: { type: Boolean, default: true }, // ¿mostrar en el formulario de edición?
      inherited: { type: Boolean, default: true } // ¿el producto puede sobreescribirlo?
    }
  ],

  // Representación visual
  icon: { type: String }, // Emoji o icono tipo Material
  imageUrl: { type: String },
  color: { type: String }, // Ej: "#FFAA00"

  // Organización y visualización
  displayOrder: { type: Number, default: 0 },
  group: { type: String }, // Ej: "Proteínas", "Veggie", "Bebidas"

  // Flags inteligentes
  isActive: { type: Boolean, default: true },
  isSelectable: { type: Boolean, default: true }, // Si puede ser usada por un admin al crear producto
  showInFilters: { type: Boolean, default: true }, // Mostrar en filtros del frontend

  // Extras para auditoría o futuras mejoras
  createdBy: { type: String }, // usuario o sistema
  notes: { type: String } // info interna
}, { timestamps: true });

module.exports = mongoose.model('ProductCategory', ProductCategorySchema);