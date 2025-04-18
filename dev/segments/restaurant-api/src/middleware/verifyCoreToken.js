///home/parallels/proxime-backend/dev/segments/restaurant-api/src/middleware/verifyAdminCoreToken.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.RESTAURANT_API_SECRET);
    
    // Este token no representa un usuario, sino una app autorizada
    if (!payload || payload.type !== 'core') {
      return res.status(403).json({ error: 'Invalid token type' });
    }

    req.coreApp = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid or expired' });
  }
};