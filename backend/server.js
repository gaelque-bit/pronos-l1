// server.js
require('dotenv').config();

const express = require('express');
const path    = require('path');
const app     = express();

app.use(express.json());

// ── Routes publiques ───────────────────────────────────────────────────────
app.use('/api', require('./routes/auth'));
app.use('/api', require('./routes/ranking'));

// ── Routes protégées ───────────────────────────────────────────────────────
const authMiddleware = require('./middlewares/auth');
app.use('/api', authMiddleware, require('./routes/predict'));

// ── Route de test ──────────────────────────────────────────────────────────
app.get('/api', (req, res) => {
  res.json({ message: '🚀 Serveur Pronos CDM opérationnel !' });
});

// ── Cron jobs ──────────────────────────────────────────────────────────────
require('./jobs/syncMatches');

// ── Route admin ────────────────────────────────────────────────────────────
const { syncMatches } = require('./jobs/syncMatches');
app.post('/api/admin/sync', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Accès refusé.' });
  }
  await syncMatches();
  res.json({ message: 'Synchronisation terminée.' });
});

// ── Frontend ───────────────────────────────────────────────────────────────
const distPath = path.join(__dirname, '../frontend/dist');
console.log('📁 Chemin frontend dist:', distPath);
app.use(express.static(distPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// ── Démarrage ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur prêt sur http://localhost:${PORT}`);
});