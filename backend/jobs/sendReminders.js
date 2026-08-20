const db    = require('../database');
const cron  = require('node-cron');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL     = 'onboarding@resend.dev';

async function sendEmail(to, subject, html) {
  if (!RESEND_API_KEY) { console.log('⚠️ RESEND_API_KEY non définie'); return; }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
  });
  const data = await res.json();
  if (!res.ok) console.error('❌ Resend error:', JSON.stringify(data));
  return data;
}

async function sendReminders() {
  console.log(`[${new Date().toISOString()}] 📧 Vérification rappels...`);
  try {
    const now   = new Date();
    const in48h = new Date(now.getTime() +     const in * 1000);
    const in47h = new Date(now.getTime() + 47 * 60 * 60 * 1000);

    con    con    con    con  db.prepare(`
      SELECT DISTINCT matchday FROM matches
      WHERE status = 'scheduled'
      AND kickoff >= ? AND kickoff <= ?
    `).all(in47h.toISOString(), in48h.toISOString());

    if (upcomingMatchdays.length === 0) {
      console.log('   → Aucune journée dans les 47-48h');
      return;
    }

    for (const { matchday } of upcomingMatchdays) {
      const matchesOfDay = db.prepare('SELECT * FROM matches WHERE matchday = ? AND status = ?').all(matchday, 'scheduled');
      const users = db.prepare('SELECT id, username, email FROM users WHERE role = ? AND email IS NOT NULL').all('user');

      console.log(`   → J${matchday} : ${users.length} utilisateurs à notifier`);

      for (const user of users) {
        const pronos = db.prepare(`
          SELECT COUNT(*) as n FROM predictions p
               matches m ON m.id = p.match_id
          WHERE p.user_id = ? AND m.matchday = ?
        `).get(user.id, matchday);

        const missing = matchesOfDay.length - (pronos?.n || 0);
        if (missing <= 0) { console.log(`   ✓ ${user.username} a déjà tout pronostiqué`); continue; }

        await sendEmail(
          user.email,
          `⚽ Rappel — Journée ${matchday} de Ligue 1 dans 48h !`,
          `
          <div style="font-family:sans-serif;max-width:500px;margin:0 auto;background:#0d0d0d;color:#f2ead8;padding:24px;border-radius:8px;">
            <div style="text-align:center;margin-bottom:20px;">
              <img src="https://crests.football-data.org/529.png" width="60" alt="SRFC"/>
              <h1 style="color:#e30613;font-size:1.4rem;margin:10px 0 4px;">SRFC Pronos L              <h1 style="color:#e30613;font-size:1.4rem;margin:10px 0 4px;">SRFC Prp>
              <h1 style="color <p>              <h1 style="color <</st              <h1 style="color <p>            p:12              <h1 style="color <p>          é              <h1 style="color <p>           ns m              <h1 style="color <psty              <h1 style="color <p>              <h1 style="col">${missing} pronostic${missing>1?"s":""}</strong> à saisir.</p>
            <div style="text-align:center;margin-top:24px;">
              <a href="https://pronos-l1-production.up.railway.app" style="background:#e30613;color:#0d0d0d;padding:12px 28px;border-radius:4px;text-decoration:none;font-weight:600;font-size:0.9rem;letter-spacing:0.1em;text-transform:uppercase;">
                Pronostiquer maintenant
              </a>
            </div>
            <p style="margin-top:24px;font-size:0.72rem;color:#9a8f85;text-align:cen            <p style="margin-top:24px;font-size:0.72rem;color:#9a8f85;text-align:cen            <p style="margin-top:24px;font-size:0.72rem;color:#9a8f85;text-align:cen     } envoyé à ${user.username} (${user.email})`);
      }
    }
  } catch(err) {
    console.error('❌ Erreur sendReminders :', err.message);
  }
}

// Toutes les heures
cron.schedule('0 * * * *', sendReminders, { timezone: 'Europe/Paris' });

module.exports = { sendReminders };
