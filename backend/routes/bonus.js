const express = require('express');
const router  = express.Router();
const db      = require('../database');

const LOCK_DATE = new Date('2026-08-22T17:00:00Z'); // Veille du 1er match

// GET /api/bonus-saison — charger les réponses de l'utilisateur
router.get('/bonus-saison', (req, res) => {
  const bonus = db.prepare('SELECT * FROM bonus_saison WHERE user_id = ?').get(req.user.id);
  res.json({ bonus: bonus || null, locked: new Date() >= LOCK_DATE });
});

// POST /api/bonus-saison — sauvegarder les réponses
router.post('/bonus-saison', (req, res) => {
  if (new Date() >= LOCK_DATE)
    return res.status(403).json({ error: 'Les bonus de début de saison sont fermés.' });

  const {
    champion, euro1, euro2, euro3, euro4,
    barragiste, relegate1, relegate2,
    meilleur_buteur, classement_rennes
  } = req.body;

  db.prepare(`
    INSERT INTO bonus_saison (user_id, champion, euro1, euro2, euro3, euro4, barragiste, relegate1, relegate2, meilleur_buteur, classement_rennes, submitted_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    ON CONFLICT(user_id) DO UPDATE SET
      champion          = excluded.champion,
      euro1             = excluded.euro1,
      euro2             = excluded.euro2,
      euro3             = excluded.euro3,
      euro4             = excluded.euro4,
      barragiste        = excluded.barragiste,
      relegate1         = excluded.relegate1,
      relegate2         = excluded.relegate2,
      meilleur_buteur   = excluded.meilleur_buteur,
      classement_rennes = excluded.classement_rennes,
      submitted_at      = datetime('now')
  `).run(
    req.user.id, champion, euro1, euro2, euro3, euro4,
    barragiste, relegate1, relegate2, meilleur_buteur, classement_rennes
  );

  res.json({ message: 'Bonus saison enregistré.' });
});

module.exports = router;