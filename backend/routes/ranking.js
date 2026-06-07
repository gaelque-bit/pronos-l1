// routes/ranking.js
const express = require('express');
const router  = express.Router();
const db      = require('../database');

// GET /api/matches — liste des matchs depuis SQLite
router.get('/matches', (req, res) => {
  const matches = db.prepare(`
    SELECT * FROM matches ORDER BY kickoff ASC
  `).all();
  return res.json({ matches });
});

// GET /api/ranking — classement général
router.get('/ranking', (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT
        u.id, u.username,
        COALESCE(SUM(p.points_earned), 0)                              AS points_matchs,
        COALESCE(b.points_bonus, 0)                                    AS points_bonus,
        COALESCE(SUM(p.points_earned), 0) + COALESCE(b.points_bonus, 0) AS total,
        COUNT(CASE WHEN m.status = 'finished' AND p.points_earned IS NOT NULL THEN 1 END) AS pronos_joues,
        COUNT(CASE WHEN p.points_earned = 3 THEN 1 END)               AS scores_exacts,
        COUNT(CASE WHEN p.points_earned = 1 THEN 1 END)               AS bons_resultats
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

module.exports = router;