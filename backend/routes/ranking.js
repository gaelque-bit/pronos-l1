const express = require('express');
const router  = express.Router();
const db      = require('../database');

// GET /api/matches
router.get('/matches', (req, res) => {
  const matches = db.prepare('SELECT * FROM matches ORDER BY kickoff ASC').all();
  return res.json({ matches });
});

// GET /api/ranking
router.get('/ranking', (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT
        u.id, u.username,
        COALESCE(SUM(p.points_earned), 0)                               AS points_matchs,
        COALESCE(b.points_bonus, 0)                                     AS points_bonus,
        COALESCE(SUM(p.points_earned), 0) + COALESCE(b.points_bonus, 0) AS total,
        COUNT(CASE WHEN m.status = 'finished' AND p.id IS NOT NULL THEN 1 END) AS pronos_joues,
        COUNT(CASE WHEN p.points_earned = 6 THEN 1 END)                AS scores_exacts,
        COUNT(CASE WHEN p.points_earned = 4 THEN 1 END)                AS bonnes_diff,
        COUNT(CASE WHEN p.points_earned = 2 THEN 1 END)                AS bons_resultats
      FROM users u
      LEFT JOIN predictions p ON p.user_id = u.id
      LEFT JOIN matches m     ON m.id = p.match_id
      LEFT JOIN bonus b       ON b.user_id = u.id
      WHERE u.role = 'user'
      GROUP BY u.id, u.username, b.points_bonus
      ORDER BY total DESC, scores_exacts DESC, pronos_joues ASC
    `).all();

    let rang = 1;
    const classement = rows.map((row, index) => {
      if (index > 0 && row.total < rows[index - 1].total) rang = index + 1;
      return { rang, ...row };
    });

    return res.json({ updated_at: new Date().toISOString(), classement });
  } catch(err) {
    console.error('Erreur classement :', err.message);
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// GET /api/evolution — points cumulés par journée pour chaque joueur
router.get('/evolution', (req, res) => {
  try {
    const users = db.prepare("SELECT id, username FROM users WHERE role = 'user' ORDER BY username ASC").all();
    const days  = db.prepare("SELECT DISTINCT matchday FROM matches WHERE matchday IS NOT NULL AND status = 'finished' ORDER BY matchday ASC").all().map(r => r.matchday);

    if (days.length === 0) return res.json({ users: [], days: [], series: [] });

    const series = users.map(user => {
      let cumul = 0;
      const points = days.map(day => {
        const row = db.prepare(`
          SELECT COALESCE(SUM(p.points_earned), 0) AS pts
          FROM predictions p
          JOIN matches m ON m.id = p.match_id
          WHERE p.user_id = ? AND m.matchday = ? AND m.status = 'finished'
        `).get(user.id, day);
        cumul += row?.pts || 0;
        return cumul;
      });
      return { id: user.id, username: user.username, points };
    });

    return res.json({ users: users.map(u=>u.username), days, series });
  } catch(err) {
    console.error('Erreur évolution :', err.message);
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
});

module.exports = router;