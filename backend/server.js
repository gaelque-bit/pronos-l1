require('dotenv').config();
const express = require('express');
const path    = require('path');
const app     = express();
app.use(express.json());

// ── Routes publiques ───────────────────────────────────────────────────────
app.use('/api', require('./routes/auth'));
app.use('/api', require('./routes/ranking'));

// ── Routes admin ───────────────────────────────────────────────────────────
app.use('/api', require('./routes/admin'));

// ── Middleware auth ────────────────────────────────────────────────────────
const authMiddleware = require('./middlewares/auth');

// ── Routes mixtes (publiques + protégées selon la route) ──────────────────
app.use('/api', require('./routes/predict'));
app.use('/api', authMiddleware, require('./routes/bonus'));
app.use('/api', authMiddleware, require('./routes/distinctions'));

// ── Route de test ──────────────────────────────────────────────────────────
app.get('/api', (req, res) => {
  res.json({ message: '🚀 Serveur Pronos CDM opérationnel !' });
});

// ── Cron jobs + sync au démarrage ──────────────────────────────────────────
require('./jobs/syncMatches');
const { syncMatches } = require('./jobs/syncMatches');
syncMatches().catch(console.error);

// ── Frontend ───────────────────────────────────────────────────────────────
const distPath = path.join(__dirname, 'dist');
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