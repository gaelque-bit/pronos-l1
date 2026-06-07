// server.js
require('dotenv').config(); // Charge les variables du fichier .env

const express = require('express');
const app     = express();

// Permet à Express de lire le JSON envoyé par le frontend
app.use(express.json());

// ── Routes publiques (pas besoin d'être connecté) ──────────────────────────
app.use('/api', require('./routes/auth'));
app.use('/api', require('./routes/ranking'));

// ── Routes protégées (token JWT obligatoire) ───────────────────────────────
const authMiddleware = require('./middlewares/auth');
app.use('/api', authMiddleware, require('./routes/predict'));

// ── Route de test — pour vérifier que le serveur fonctionne ───────────────
app.get('/', (req, res) => {
  res.json({ message: '🚀 Serveur Pronos CDM opérationnel !' });
});

// ── Cron jobs — synchronisation automatique des matchs ────────────────────
require('./jobs/syncMatches');

// ── Route admin : sync manuelle depuis le panneau admin ───────────────────
const { syncMatches } = require('./jobs/syncMatches');
app.post('/api/admin/sync', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Accès refusé.' });
  }
  await syncMatches();
  res.json({ message: 'Synchronisation terminée.' });
});

// ── Démarrage du serveur ───────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur prêt sur http://localhost:${PORT}`);
});