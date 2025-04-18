const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('Authorization Header:', authHeader);
  console.log('CORE_API_SECRET:', process.env.CORE_API_SECRET);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.CORE_API_SECRET);
    console.log('Token Payload:', payload);

    if (!payload || payload.type !== 'core') {
      return res.status(403).json({ error: 'Invalid token type' });
    }

    req.coreApp = payload;
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(401).json({ error: 'Token invalid or expired' });
  }
};