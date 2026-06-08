const express = require('express');
const router  = express.Router();
const db      = require('../database');

router.get('/distinctions', (req, res) => {
  try {
    const users = db.prepare(`
      SELECT u.id, u.username,
        COALESCE(SUM(p.points_earned), 0) AS total,
        COUNT(CASE WHEN p.points_earned = 6 THEN 1 END) AS scores_exacts,
        COALESCE(b.points_bonus, 0) AS bonus
      FROM users u
      LEFT JOIN predictions p ON p.user_id = u.id
      LEFT JOIN bonus b ON b.user_id = u.id
      WHERE u.role != 'admin'
      GROUP BY u.id
    `).all();

    if (users.length === 0) return res.json({ distinctions: [] });

    const sorted = [...users].sort((a,b) => b.total - a.total);
    const champion = sorted[0];
    const lanterne = sorted[sorted.length - 1];
    const roiExact = [...users].sort((a,b) => b.scores_exacts - a.scores_exacts)[0];
    const roiBonus = [...users].sort((a,b) => b.bonus - a.bonus)[0];

    const phaseAller = db.prepare(`
      SELECT u.id, u.username, COALESCE(SUM(p.points_earned),0) AS pts
      FROM users u
      LEFT JOIN predictions p ON p.user_id = u.id
      LEFT JOIN matches m ON m.id = p.match_id
      WHERE m.matchday <= 3 AND u.role != 'admin'
      GROUP BY u.id ORDER BY pts DESC LIMIT 1
    `).get();

    const phaseRetour = db.prepare(`
      SELECT u.id, u.username, COALESCE(SUM(p.points_earned),0) AS pts
      FROM users u
      LEFT JOIN predictions p ON p.user_id = u.id
      LEFT JOIN matches m ON m.id = p.match_id
      WHERE m.matchday > 3 AND u.role != 'admin'
      GROUP BY u.id ORDER BY pts DESC LIMIT 1
    `).get();

    const pronFrance = db.prepare(`
      SELECT u.id, u.username, COALESCE(SUM(p.points_earned),0) AS pts
      FROM users u
      LEFT JOIN predictions p ON p.user_id = u.id
      LEFT JOIN matches m ON m.id = p.match_id
      WHERE (m.home_team = 'France' OR m.away_team = 'France') AND u.role != 'admin'
      GROUP BY u.id ORDER BY pts DESC LIMIT 1
    `).get();

    const allMatchdays = db.prepare(`
      SELECT DISTINCT matchday FROM matches WHERE matchday IS NOT NULL ORDER BY matchday
    `).all().map(r => r.matchday);

    // Meilleure série
    let bestStreak = { username: null, streak: 0 };
    for (const user of users) {
      let currentStreak = 0, maxStreak = 0;
      for (const day of allMatchdays) {
        const dayPts = db.prepare(`
          SELECT COALESCE(SUM(p.points_earned),0) AS pts
          FROM predictions p JOIN matches m ON m.id = p.match_id
          WHERE p.user_id = ? AND m.matchday = ?
        `).get(user.id, day);
        const topDay = db.prepare(`
          SELECT MAX(total) AS max FROM (
            SELECT COALESCE(SUM(p.points_earned),0) AS total
            FROM predictions p JOIN matches m ON m.id = p.match_id
            WHERE m.matchday = ? GROUP BY p.user_id
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

    // Plus forte progression
    const mid = Math.floor(allMatchdays.length / 2);
    const firstHalf = allMatchdays.slice(0, mid);
    const secondHalf = allMatchdays.slice(mid);
    let bestProgression = { username: null, progression: -Infinity };

    for (const user of users) {
      let pts1 = 0, pts2 = 0;
      if (firstHalf.length > 0) {
        const r = db.prepare(`
          SELECT COALESCE(SUM(p.points_earned),0) AS pts FROM predictions p
          JOIN matches m ON m.id = p.match_id
          WHERE p.user_id = ? AND m.matchday IN (${firstHalf.map(()=>'?').join(',')})
        `).get(user.id, ...firstHalf);
        pts1 = r?.pts || 0;
      }
      if (secondHalf.length > 0) {
        const r = db.prepare(`
          SELECT COALESCE(SUM(p.points_earned),0) AS pts FROM predictions p
          JOIN matches m ON m.id = p.match_id
          WHERE p.user_id = ? AND m.matchday IN (${secondHalf.map(()=>'?').join(',')})
        `).get(user.id, ...secondHalf);
        pts2 = r?.pts || 0;
      }
      const prog = pts2 - pts1;
      if (prog > bestProgression.progression) {
        bestProgression = { username: user.username, progression: prog };
      }
    }

    const distinctions = [
      { emoji:"🥇", label:"Champion des Pronos",               username: champion?.username,        detail: `${champion?.total} pts` },
      { emoji:"🏆", label:"Roi du Score Exact",                username: roiExact?.username,         detail: `${roiExact?.scores_exacts} exacts` },
      { emoji:"🎯", label:"Roi des Bonus Saison",              username: roiBonus?.username,         detail: `${roiBonus?.bonus} pts bonus` },
      { emoji:"⚽", label:"Meilleur · Phase aller",            username: phaseAller?.username,       detail: `${phaseAller?.pts || 0} pts` },
      { emoji:"⚽", label:"Meilleur · Phase retour",           username: phaseRetour?.username,      detail: `${phaseRetour?.pts || 0} pts` },
      { emoji:"📈", label:"Plus forte progression",            username: bestProgression?.username,  detail: bestProgression?.progression > 0 ? `+${bestProgression.progression} pts` : "—" },
      { emoji:"🔥", label:"Meilleure série de journées",       username: bestStreak?.username,       detail: `${bestStreak?.streak} journée${bestStreak?.streak > 1 ? 's' : ''}` },
      { emoji:"🥴", label:"Lanterne Rouge",                    username: lanterne?.username,         detail: `${lanterne?.total} pts` },
      { emoji:"🇫🇷", label:"Meilleur pronostic France",        username: pronFrance?.username,       detail: `${pronFrance?.pts || 0} pts` },
    ];

    res.json({ distinctions });
  } catch(e) {
    console.error('Erreur distinctions:', e.message);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;