const express  = require('express');
const router   = express.Router();
const bcrypt   = require('bcrypt');
const jwt      = require('jsonwebtoken');
const db       = require('../database');
const isAdmin  = require('../middlewares/isAdmin');

const JWT_SECRET     = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// ── POST /api/admin/login ─────────────────────────────────────────────────────
router.post('/admin/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: 'username et password sont obligatoires.' });

  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user || user.role !== 'admin')
    return res.status(403).json({ error: 'Accès refusé.' });

  let ok = false;
  if (ADMIN_PASSWORD && password === ADMIN_PASSWORD) {
    ok = true;
  } else {
    ok = await bcrypt.compare(password, user.password_hash);
  }
  if (!ok) return res.status(401).json({ error: 'Identifiants incorrects.' });

  const token = jwt.sign(
    { id: user.id, username: user.username, role: 'admin' },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return res.json({ token, user: { id: user.id, username: user.username, role: 'admin' } });
});

// ── GET /api/admin/users ──────────────────────────────────────────────────────
router.get('/admin/users', isAdmin, (req, res) => {
  const users = db.prepare(`
    SELECT u.id, u.username, u.role, u.created_at,
           COUNT(DISTINCT p.id) AS pronos_count,
           COALESCE(SUM(p.points_earned), 0) AS total_points
    FROM users u
    LEFT JOIN predictions p ON p.user_id = u.id
    GROUP BY u.id
    ORDER BY u.created_at DESC
  `).all();
  res.json({ users });
});

// ── DELETE /api/admin/users/:id ───────────────────────────────────────────────
router.delete('/admin/users/:id', isAdmin, (req, res) => {
  const { id } = req.params;
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  if (!user) return res.status(404).json({ error: 'Utilisateur introuvable.' });
  if (user.role === 'admin') return res.status(403).json({ error: 'Impossible de supprimer un admin.' });

  db.prepare('DELETE FROM predictions WHERE user_id = ?').run(id);
  db.prepare('DELETE FROM bonus WHERE user_id = ?').run(id);
  db.prepare('DELETE FROM users WHERE id = ?').run(id);

  res.json({ message: `Utilisateur ${user.username} supprimé.` });
});

// ── GET /api/admin/matches ────────────────────────────────────────────────────
router.get('/admin/matches', isAdmin, (req, res) => {
  const matches = db.prepare('SELECT * FROM matches ORDER BY kickoff ASC').all();
  res.json({ matches });
});

// ── Fonction calcul points (barème 6/4/2/0) ───────────────────────────────────
function calcPoints(pred_home, pred_away, score_home, score_away) {
  const exactScore = pred_home === score_home && pred_away === score_away;
  const correctResult =
    (pred_home > pred_away && score_home > score_away) ||
    (pred_home < pred_away && score_home < score_away) ||
    (pred_home === pred_away && score_home === score_away);
  const correctDiff = correctResult && (pred_home - pred_away) === (score_home - score_away);

  if (exactScore)         return 6;
  if (correctDiff)        return 4;
  if (correctResult)      return 2;
  return 0;
}

// ── PATCH /api/admin/matches/:id ──────────────────────────────────────────────
router.patch('/admin/matches/:id', isAdmin, (req, res) => {
  const { id } = req.params;
  const { score_home, score_away } = req.body;

  if (score_home === undefined || score_away === undefined)
    return res.status(400).json({ error: 'score_home et score_away sont obligatoires.' });

  const match = db.prepare('SELECT * FROM matches WHERE id = ?').get(id);
  if (!match) return res.status(404).json({ error: 'Match introuvable.' });

  db.prepare(`
    UPDATE matches SET score_home = ?, score_away = ?, status = 'finished' WHERE id = ?
  `).run(score_home, score_away, id);

  const predictions = db.prepare('SELECT * FROM predictions WHERE match_id = ?').all(id);
  const updatePts = db.prepare('UPDATE predictions SET points_earned = ? WHERE id = ?');

  for (const pred of predictions) {
    const pts = calcPoints(pred.pred_home, pred.pred_away, score_home, score_away);
    updatePts.run(pts, pred.id);
  }

  res.json({ message: `Score corrigé : ${score_home}-${score_away}. ${predictions.length} pronostic(s) recalculé(s).` });
});

// ── POST /api/admin/sync ──────────────────────────────────────────────────────
router.post('/admin/sync', isAdmin, async (req, res) => {
  try {
    const { syncMatches } = require('../jobs/syncMatches');
    await syncMatches();
    res.json({ message: 'Synchronisation terminée.' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
module.exports.calcPoints = calcPoints;