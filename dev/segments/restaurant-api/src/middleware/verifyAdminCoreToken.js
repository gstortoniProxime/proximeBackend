const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1];

  try {
    // Usás la misma clave que usa proxime-core-api para firmar los tokens
    const decoded = jwt.verify(token, process.env.CORE_API_SECRET);

    // Si querés asegurar que solo usuarios superadmin puedan hacer esto:
    if (decoded.role !== 'superadmin') {
      return res.status(403).json({ error: 'Not authorized as superadmin' });
    }

    req.auth = decoded; // Para que el controller lo use si quiere
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};