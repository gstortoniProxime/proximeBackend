const RestaurantBusiness = require('../models/RestaurantBusiness');

/**
 * Verifica si el usuario tiene acceso al business
 */
function validateBusinessAccess(resourceBusinessId, tokenBusinessId) {
  console.log("resourceBusinessId:", resourceBusinessId + "tokenBusinessId:", tokenBusinessId);
  if (resourceBusinessId.toString() !== tokenBusinessId.businessId) {
    console.log(resourceBusinessId.toString() + "||" + tokenBusinessId.businessId);  
    const err = new Error('Not authorized');
    err.status = 403;
    throw err;
  }
}

/**
 * Verifica si el usuario tiene el rol permitido
 */
function validateRole(req, allowedRoles = []) {
  console.log('GS - Auth' + req.role);
  if (!allowedRoles.includes(req?.role)) {
    const err = new Error('No autorizado para esta acción');
    err.status = 403;
    throw err;
  }
}

/**
 * Construye un query Mongo a partir de filtros enviados por POST
 */
function buildMongoFilters(filters = []) {
  const mongoQuery = {};

  filters.forEach(({ field, type, value }) => {
    switch (type) {
      case 'equal':
        mongoQuery[field] = value;
        break;
      case 'like':
        mongoQuery[field] = { $regex: value, $options: 'i' }; // insensible a mayúsculas
        break;
      case 'in':
        mongoQuery[field] = { $in: value }; // value debe ser array
        break;
      case 'gt':
        mongoQuery[field] = { $gt: value };
        break;
      case 'lt':
        mongoQuery[field] = { $lt: value };
        break;
      case 'gte':
        mongoQuery[field] = { $gte: value };
        break;
      case 'lte':
        mongoQuery[field] = { $lte: value };
        break;
      case 'ne':
        mongoQuery[field] = { $ne: value };
        break;
      default:
        console.warn(`Filtro no reconocido: ${type}`);
        break;
    }
  });

  return mongoQuery;
}

module.exports = {
  validateBusinessAccess,
  validateRole,
  buildMongoFilters
};