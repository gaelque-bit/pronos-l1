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

// GET /api/predictions — pronostics de l'utilisateur connecté
router.get('/predictions', (req, res) => {
  const userId = req.user?.id;
  if (!userId)
    return res.status(401).json({ error: 'Non connecté.' });

  const predictions = db.prepare(
    'SELECT * FROM predictions WHERE user_id = ?'
  ).all(userId);

  return res.json({ predictions });
});

// GET /api/predictions/match/:matchId — pronos de tous les joueurs pour un match
router.get('/predictions/match/:matchId', (req, res) => {
  const { matchId } = req.params;
  const now = new Date();
  const match = db.prepare('SELECT * FROM matches WHERE id=?').get(matchId);
  if (!match) return res.status(404).json({ error: 'Match introuvable.' });

  if (new Date(match.kickoff) > now && match.status === 'scheduled')
    return res.status(403).json({ error: 'Match pas encore commencé.' });

  const predictions = db.prepare(`
    SELECT u.username, p.pred_home, p.pred_away, p.points_earned
    FROM predictions p
    JOIN users u ON u.id = p.user_id
    WHERE p.match_id = ?
    ORDER BY p.points_earned DESC, u.username ASC
  `).all(matchId);

  res.json({ match, predictions });
});

// GET /api/predictions/user/:userId — historique d'un participant
router.get('/predictions/user/:userId', (req, res) => {
  const { userId } = req.params;
  const viewerId = req.user?.id;

  const user = db.prepare('SELECT id, username FROM users WHERE id = ? AND role = ?').get(userId, 'user');
  if (!user) return res.status(404).json({ error: 'Utilisateur introuvable.' });

  const isOwnProfile = viewerId && +viewerId === +userId;

  const predictions = db.prepare(`
    SELECT
      p.id,
      CASE
        WHEN ? = 1 THEN p.pred_home
        WHEN m.status != 'scheduled' OR datetime(m.kickoff) <= datetime('now') THEN p.pred_home
        ELSE NULL
      END AS pred_home,
      CASE
        WHEN ? = 1 THEN p.pred_away
        WHEN m.status != 'scheduled' OR datetime(m.kickoff) <= datetime('now') THEN p.pred_away
        ELSE NULL
      END AS pred_away,
      p.points_earned,
      m.id AS match_id, m.home_team, m.away_team, m.score_home, m.score_away,
      m.status, m.kickoff, m.stage, m.group_name, m.matchday
    FROM predictions p
    JOIN matches m ON m.id = p.match_id
    WHERE p.user_id = ?
    ORDER BY m.kickoff ASC
  `).all(isOwnProfile ? 1 : 0, isOwnProfile ? 1 : 0, userId);

  const bonus = db.prepare('SELECT * FROM bonus WHERE user_id = ?').get(userId);

  return res.json({ user, predictions, bonus: bonus || null });
});

module.exports = router;