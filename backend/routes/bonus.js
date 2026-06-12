const express = require('express');
const router  = express.Router();
const db      = require('../database');

// GET /api/bonus — charger les réponses bonus de l'utilisateur connecté
router.get('/bonus', (req, res) => {
  const bonus = db.prepare('SELECT * FROM bonus WHERE user_id = ?').get(req.user.id);
  res.json({ bonus: bonus || null });
});

// POST /api/bonus — sauvegarder une réponse bonus
router.post('/bonus', (req, res) => {
  const { questionId, answerId } = req.body;
  if (!questionId || !answerId)
    return res.status(400).json({ error: 'questionId et answerId sont obligatoires.' });

  const now = new Date();
  const lockDate = new Date('2026-06-12T22:00:00Z');
  if (now >= lockDate)
    return res.status(403).json({ error: 'Les bonus sont fermés.' });

  db.prepare('INSERT OR IGNORE INTO bonus (user_id) VALUES (?)').run(req.user.id);

  if (questionId === 'winner') {
    db.prepare('UPDATE bonus SET winner_id = ? WHERE user_id = ?').run(answerId, req.user.id);
  } else if (questionId === 'topscorer') {
    db.prepare('UPDATE bonus SET top_scorer_id = ? WHERE user_id = ?').run(answerId, req.user.id);
  } else {
    return res.status(400).json({ error: 'Question inconnue.' });
  }

  res.json({ message: 'Bonus enregistré.' });
});

module.exports = router;