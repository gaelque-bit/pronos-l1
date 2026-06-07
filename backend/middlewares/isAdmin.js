// middlewares/isAdmin.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = function isAdmin(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Token manquant.' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token manquant.' });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.role !== 'admin') {
      return res.status(403).json({ error: 'Accès réservé aux administrateurs.' });
    }
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Token invalide ou expiré.' });
  }
};