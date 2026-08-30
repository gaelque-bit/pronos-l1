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
    // Crée la table bonus_journee si elle n'existe pas
    db.exec(`CREATE TABLE IF NOT EXISTS bonus_journee (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      matchday INTEGER NOT NULL,
      pts INTEGER DEFAULT 5,
      UNIQUE(user_id, matchday)
    )`);

    const rows = db.prepare(`
      SELECT
        u.id, u.username,
        COALESCE(SUM(p.points_earned), 0) AS points_matchs,
        COALESCE(bs.points_bonus, 0) AS points_bonus_saison,
        COALESCE((SELECT SUM(bj.pts) FROM bonus_journee bj WHERE bj.user_id = u.id), 0) AS points_bonus_journee,
        COALESCE(SUM(p.points_earned), 0)
          + COALESCE(bs.points_bonus, 0)
          + COALESCE((SELECT SUM(bj.pts) FROM bonus_journee bj WHERE bj.user_id = u.id), 0) AS total,
        COUNT(CASE WHEN m.status = 'finished' AND p.id IS NOT NULL THEN 1 END) AS pronos_joues,
        COUNT(CASE WHEN p.points_earned = 6 THEN 1 END) AS scores_exacts,
        COUNT(CASE WHEN p.points_earned = 4 THEN 1 END) AS bonnes_diff,
        COUNT(CASE WHEN p.points_earned = 2 THEN 1 END) AS bons_resultats
      FROM users u
      LEFT JOIN predictions p   ON p.user_id = u.id
      LEFT JOIN matches m       ON m.id = p.match_id
      LEFT JOIN bonus_saison bs ON bs.user_id = u.id
      WHERE u.role = 'user'
      GROUP BY u.id, u.username, bs.points_bonus
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

        let bonusJournee = 0;
        try {
          const bj = db.prepare('SELECT COALESCE(pts, 0) AS pts FROM bonus_journee WHERE user_id = ? AND matchday = ?').get(user.id, day);
          bonusJournee = bj?.pts || 0;
        } catch(e) {}

        cumul += (row?.pts || 0) + bonusJournee;
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

// GET /api/series — série en cours pour chaque joueur
router.get('/series', (req, res) => {
  try {
    const users = db.prepare("SELECT id, username FROM users WHERE role='user'").all();
    const days  = db.prepare("SELECT DISTINCT matchday FROM matches WHERE matchday IS NOT NULL AND status='finished' ORDER BY matchday DESC").all().map(r=>r.matchday);

    const series = users.map(user => {
      let streak = 0;
      for (const day of days) {
        const pts = db.prepare(`
          SELECT COALESCE(SUM(p.points_earned),0) AS pts
          FROM predictions p JOIN matches m ON m.id=p.match_id
          WHERE p.user_id=? AND m.matchday=? AND m.status='finished'
        `).get(user.id, day);
        if (pts && pts.pts > 0) streak++;
        else break;
      }
      return { id: user.id, username: user.username, streak };
    });

    res.json({ series });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/ranking/journee/:day — classement d'une journée spécifique
router.get('/ranking/journee/:day', (req, res) => {
  try {
    const { day } = req.params;
    const rows = db.prepare(`
      SELECT
        u.id, u.username,
        COALESCE(SUM(p.points_earned), 0) AS pts_journee
      FROM users u
      LEFT JOIN predictions p ON p.user_id = u.id
      LEFT JOIN matches m ON m.id = p.match_id AND m.matchday = ? AND m.status = 'finished'
      WHERE u.role = 'user'
      GROUP BY u.id, u.username
      ORDER BY pts_journee DESC
    `).all(day);

    res.json({ journee: +day, classement: rows });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/l1standings — classement réel Ligue 1
router.get('/l1standings', async (req, res) => {
  try {
    const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
    const response = await fetch(
      'https://api.football-data.org/v4/competitions/FL1/standings',
      { headers: { 'X-Auth-Token': process.env.FOOTBALL_API_KEY } }
    );
    const data = await response.json();
    const standings = data?.standings?.[0]?.table || [];
    res.json({ standings });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/actu — actualités Ligue 1 + Stade Rennais
router.get('/actu', async (req, res) => {
  try {
    const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
    const KEY = process.env.NEWS_API_KEY;
    const [l1Res, srfcRes] = await Promise.all([
     fetch(`https://newsapi.org/v2/everything?q=%22Ligue+1%22+football+France&language=fr&sortBy=publishedAt&pageSize=10&apiKey=${KEY}`),
      fetch(`https://newsapi.org/v2/everything?q=%22Stade+Rennais%22+(match+OR+victoire+OR+défaite+OR+but+OR+Ligue+1+OR+journée+OR+saison)&language=fr&sortBy=publishedAt&pageSize=10&apiKey=${KEY}`)
    ]);
    const [l1Data, srfcData] = await Promise.all([l1Res.json(), srfcRes.json()]);
    res.json({
      l1: (l1Data.articles || []).slice(0,8),
      srfc: (srfcData.articles || [])
  .filter(a => a.title && (
    a.title.toLowerCase().includes('rennais') || 
    a.title.toLowerCase().includes('rennes') ||
    a.title.toLowerCase().includes('roazhon')
  ))
  .slice(0,8),
    });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});
// GET /api/team-form/:teamApiId — derniers matchs d'une équipe
router.get('/team-form/:teamApiId', async (req, res) => {
  try {
    const { teamApiId } = req.params;
    const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
    const response = await fetch(
      `https://api.football-data.org/v4/teams/${teamApiId}/matches?status=FINISHED&limit=10`,
      { headers: { 'X-Auth-Token': process.env.FOOTBALL_API_KEY } }
    );
    const data = await response.json();
    const matches = (data.matches || []).slice(-5).map(m => ({
      homeTeam: m.homeTeam.shortName || m.homeTeam.name,
      awayTeam: m.awayTeam.shortName || m.awayTeam.name,
      homeScore: m.score.fullTime.home,
      awayScore: m.score.fullTime.away,
      date: m.utcDate,
      competition: m.competition.name,
    }));
    res.json({ matches });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/head-to-head/:homeApiId/:awayApiId — historique confrontations
router.get('/head-to-head/:homeApiId/:awayApiId', async (req, res) => {
  try {
    const { homeApiId, awayApiId } = req.params;
    const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
    const response = await fetch(
      `https://api.football-data.org/v4/teams/${homeApiId}/matches?status=FINISHED&limit=20`,
      { headers: { 'X-Auth-Token': process.env.FOOTBALL_API_KEY } }
    );
    const data = await response.json();
    const h2h = (data.matches || [])
      .filter(m => m.homeTeam.id === +awayApiId || m.awayTeam.id === +awayApiId)
      .slice(-5)
      .map(m => ({
        homeTeam: m.homeTeam.shortName || m.homeTeam.name,
        awayTeam: m.awayTeam.shortName || m.awayTeam.name,
        homeScore: m.score.fullTime.home,
        awayScore: m.score.fullTime.away,
        date: m.utcDate,
        competition: m.competition.name,
      }));
    res.json({ matches: h2h });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});
module.exports = router;