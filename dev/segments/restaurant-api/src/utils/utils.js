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
    if (!allowedRoles.includes(req.auth?.role)) {
      const err = new Error('No autorizado para esta acción');
      err.status = 403;
      throw err;
    }
  }
  
  module.exports = {
    validateBusinessAccess,
    validateRole
  };