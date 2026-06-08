const express = require('express');
const router  = express.Router();
const db      = require('../database');

// POST /api/predict
router.post('/predict', (req, res) => {
  const userId = req.user?.id;
  if (!userId)
    return res.status(401).json({ error: 'Non connecté.' });

  const { matchId, predHome, predAway } = req.body;

  if (matchId === undefined || predHome === undefined || predAway === undefined)
    return res.status(400).json({ error: 'matchId, predHome, predAway sont obligatoires.' });

  if (!Number.isInteger(predHome) || predHome < 0 ||
      !Number.isInteger(predAway) || predAway < 0)
    return res.status(400).json({ error: 'Les scores doivent être des entiers positifs.' });

  const match = db.prepare('SELECT * FROM matches WHERE id = ?').get(matchId);
  if (!match)
    return res.status(404).json({ error: 'Match introuvable.' });

  if (match.status !== 'scheduled')
    return res.status(403).json({ error: 'Ce match a déjà commencé.' });

  if (Date.now() >= new Date(match.kickoff).getTime())
    return res.status(403).json({ error: 'Le coup d\'envoi est passé.' });

  try {
    db.prepare(`
      INSERT INTO predictions (user_id, match_id, pred_home, pred_away)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(user_id, match_id) DO UPDATE SET
        pred_home    = excluded.pred_home,
        pred_away    = excluded.pred_away,
        submitted_at = datetime('now')
    `).run(userId, matchId, predHome, predAway);

    return res.status(201).json({
      message: `Pronostic enregistré : ${match.home_team} ${predHome} – ${predAway} ${match.away_team}`
    });
  } catch(err) {
    console.error('Erreur BDD :', err.message);
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// GET /api/predictions — charger tous les pronostics de l'utilisateur connecté
router.get('/predictions', (req, res) => {
  const userId = req.user?.id;
  if (!userId)
    return res.status(401).json({ error: 'Non connecté.' });

  const predictions = db.prepare(
    'SELECT * FROM predictions WHERE user_id = ?'
  ).all(userId);

  return res.json({ predictions });
});

module.exports = router;