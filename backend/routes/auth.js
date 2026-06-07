// routes/auth.js
const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');
const db      = require('../database');

const JWT_SECRET     = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const BCRYPT_ROUNDS  = 12;

// ── POST /api/auth/register ────────────────────────────────────────────────
router.post('/auth/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: 'username et password sont obligatoires.' });
  if (username.length < 3 || username.length > 20)
    return res.status(400).json({ error: 'Username entre 3 et 20 caractères.' });
  if (password.length < 8)
    return res.status(400).json({ error: 'Mot de passe : 8 caractères minimum.' });

  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
  if (existing)
    return res.status(409).json({ error: 'Ce nom d\'utilisateur est déjà pris.' });

  const password_hash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  const result = db.prepare(
    'INSERT INTO users (username, password_hash) VALUES (?, ?)'
  ).run(username, password_hash);

  const userId = result.lastInsertRowid;

  // Crée une entrée bonus vide pour ce nouvel utilisateur
  db.prepare('INSERT OR IGNORE INTO bonus (user_id) VALUES (?)').run(userId);

  const token = jwt.sign({ id: userId, username, role: 'user' }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  return res.status(201).json({
    message: `Bienvenue ${username} !`,
    token,
    user: { id: userId, username, role: 'user' }
  });
});

// ── POST /api/auth/login ───────────────────────────────────────────────────
router.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: 'username et password sont obligatoires.' });

  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user)
    return res.status(401).json({ error: 'Identifiants incorrects.' });

  const passwordOk = await bcrypt.compare(password, user.password_hash);
  if (!passwordOk)
    return res.status(401).json({ error: 'Identifiants incorrects.' });

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return res.json({
    message: `Content de te revoir, ${user.username} !`,
    token,
    user: { id: user.id, username: user.username, role: user.role }
  });
});

module.exports = router;