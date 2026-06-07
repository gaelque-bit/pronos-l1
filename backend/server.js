// server.js
require('dotenv').config();

const express = require('express');
const path    = require('path');
const app     = express();

// Permet à Express de lire le JSON envoyé par le frontend
app.use(express.json());

// ── Routes publiques (pas besoin d'être connecté) ──────────────────────────
app.use('/api', require('./routes/auth'));
app.use('/api', require('./routes/ranking'));

// ── Routes protégées (token JWT obligatoire) ───────────────────────────────
const authMiddleware = require('./middlewares/auth');
app.use('/api', authMiddleware, require('./routes/predict'));

// ── Route de test ──────────────────────────────────────────────────────────
app.get('/api', (req, res) => {
  res.json({ message: '🚀 Serveur Pronos CDM opérationnel !' });
});

// ── Cron jobs ──────────────────────────────────────────────────────────────
require('./jobs/syncMatches');

// ── Route admin : sync manuelle ────────────────────────────────────────────
const { syncMatches } = require('./jobs/syncMatches');
app.post('/api/admin/sync', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Accès refusé.' });
  }
  await syncMatches();
  res.json({ message: 'Synchronisation terminée.' });
});

// ── Sert le frontend React buildé en production ────────────────────────────
// En local Vite tourne séparément, mais en prod Railway sert les fichiers buildés
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// ── Démarrage ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur prêt sur http://localhost:${PORT}`);
});