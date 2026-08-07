const express = require('express');
const router  = express.Router();
const db      = require('../database');

router.get('/distinctions', (req, res) => {
  try {
    const users = db.prepare(`
      SELECT u.id, u.username,
        COALESCE(SUM(p.points_earned), 0) AS points_matchs,
        COALESCE(bs.points_bonus, 0) AS bonus_saison,
        COALESCE((SELECT SUM(bj.pts) FROM bonus_journee bj WHERE bj.user_id = u.id), 0) AS bonus_journee,
        COALESCE(SUM(p.points_earned), 0) + COALESCE(bs.points_bonus, 0) + COALESCE((SELECT SUM(bj.pts) FROM bonus_journee bj WHERE bj.user_id = u.id), 0) AS total,
        COUNT(CASE WHEN p.points_earned = 6 THEN 1 END) AS scores_exacts
      FROM users u
      LEFT JOIN predictions p ON p.user_id = u.id
      LEFT JOIN bonus_saison bs ON bs.user_id = u.id
      WHERE u.role != 'admin'
      GROUP BY u.id
    `).all();

    if (users.length === 0) return res.json({ distinctions: [] });

    const sorted  = [...users].sort((a,b) => b.total - a.total);
    const champion = sorted[0];
    const lanterne = sorted[sorted.length - 1];
    const roiExact = [...users].sort((a,b) => b.scores_exacts - a.scores_exacts)[0];

    // Phase aller J1-J17, retour J18-J34
    const phaseAller = db.prepare(`
      SELECT u.id, u.username, COALESCE(SUM(p.points_earned),0) AS pts
      FROM users u
      LEFT JOIN predictions p ON p.user_id = u.id
      LEFT JOIN matches m ON m.id = p.match_id
      WHERE m.matchday <= 17 AND m.status = 'finished' AND u.role != 'admin'
      GROUP BY u.id ORDER BY pts DESC LIMIT 1
    `).get();

    const phaseRetour = db.prepare(`
      SELECT u.id, u.username, COALESCE(SUM(p.points_earned),0) AS pts
      FROM users u
      LEFT JOIN predictions p ON p.user_id = u.id
      LEFT JOIN matches m ON m.id = p.match_id
      WHERE m.matchday >= 18 AND m.status = 'finished' AND u.role != 'admin'
      GROUP BY u.id ORDER BY pts DESC LIMIT 1
    `).get();

    // Meilleur pronostic SRFC (matchs de Rennes + bonus classement Rennes)
    const pronSRFC = db.prepare(`
      SELECT u.id, u.username,
        COALESCE(SUM(p.points_earned),0) AS pts_matchs,
        COALESCE(bs.points_bonus, 0) AS pts_bonus,
        COALESCE(SUM(p.points_earned),0) + COALESCE(bs.points_bonus, 0) AS pts
      FROM users u
      LEFT JOIN predictions p ON p.user_id = u.id
      LEFT JOIN matches m ON m.id = p.match_id AND (m.home_team = 'Stade Rennais' OR m.away_team = 'Stade Rennais' OR m.home_team = 'Rennes' OR m.away_team = 'Rennes')
      LEFT JOIN bonus_saison bs ON bs.user_id = u.id
      WHERE u.role != 'admin'
      GROUP BY u.id ORDER BY pts DESC LIMIT 1
    `).get();

    const allMatchdays = db.prepare(`
      SELECT DISTINCT matchday FROM matches WHERE matchday IS NOT NULL AND status = 'finished' ORDER BY matchday
    `).all().map(r => r.matchday);

    // Meilleure série de journées gagnées
    let bestStreak = { username: null, streak: 0 };
    for (const user of users) {
      let currentStreak = 0, maxStreak = 0;
      for (const day of allMatchdays) {
        const dayPts = db.prepare(`
          SELECT COALESCE(SUM(p.points_earned),0) AS pts
          FROM predictions p JOIN matches m ON m.id = p.match_id
          WHERE p.user_id = ? AND m.matchday = ? AND m.status = 'finished'
        `).get(user.id, day);
        const topDay = db.prepare(`
          SELECT MAX(total) AS max FROM (
            SELECT COALESCE(SUM(p.points_earned),0) AS total
            FROM predictions p JOIN matches m ON m.id = p.match_id
            WHERE m.matchday = ? AND m.status = 'finished' GROUP BY p.user_id
          )
        `).get(day);
        if (dayPts && topDay && dayPts.pts > 0 && dayPts.pts >= topDay.max) {
          currentStreak++;
          maxStreak = Math.max(maxStreak, currentStreak);
        } else {
          currentStreak = 0;
        }
      }
      if (maxStreak > bestStreak.streak) {
        bestStreak = { username: user.username, streak: maxStreak };
      }
    }

    // Plus forte progression aller → retour
    let bestProgression = { username: null, progression: -Infinity };
    for (const user of users) {
      const r1 = db.prepare(`
        SELECT COALESCE(SUM(p.points_earned),0) AS pts FROM predictions p
        JOIN matches m ON m.id = p.match_id
        WHERE p.user_id = ? AND m.matchday <= 17 AND m.status = 'finished'
      `).get(user.id);
      const r2 = db.prepare(`
        SELECT COALESCE(SUM(p.points_earned),0) AS pts FROM predictions p
        JOIN matches m ON m.id = p.match_id
        WHERE p.user_id = ? AND m.matchday >= 18 AND m.status = 'finished'
      `).get(user.id);
      const prog = (r2?.pts || 0) - (r1?.pts || 0);
      if (prog > bestProgression.progression) {
        bestProgression = { username: user.username, progression: prog };
      }
    }

    const distinctions = [
      { emoji:"😵", label:"Canari d'Or",                      username: lanterne?.username,        detail: `${lanterne?.total} pts` },
      { emoji:"❤️", label:"Meilleur pronostic SRFC",          username: pronSRFC?.username,        detail: `${pronSRFC?.pts || 0} pts` },
      { emoji:"🏆", label:"Roi du Score Exact",               username: roiExact?.username,        detail: `${roiExact?.scores_exacts} exacts` },
      { emoji:"⚽", label:"Meilleur · Phase aller (J1-J17)",  username: phaseAller?.username,      detail: `${phaseAller?.pts || 0} pts` },
      { emoji:"⚽", label:"Meilleur · Phase retour (J18-J34)",username: phaseRetour?.username,     detail: `${phaseRetour?.pts || 0} pts` },
      { emoji:"📈", label:"Plus forte progression",           username: bestProgression?.username, detail: bestProgression?.progression > 0 ? `+${bestProgression.progression} pts` : "—" },
      { emoji:"🔥", label:"Meilleure série de journées",      username: bestStreak?.username,      detail: `${bestStreak?.streak} journée${bestStreak?.streak > 1 ? 's' : ''}` },
    ];

    res.json({ distinctions });
  } catch(e) {
    console.error('Erreur distinctions:', e.message);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;