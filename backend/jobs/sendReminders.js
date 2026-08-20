const db    = require('../database');
const cron  = require('node-cron');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL     = 'onboarding@resend.dev';

async function sendEmail(to, subject, html) {
  if (!RESEND_API_KEY) { console.log('RESEND_API_KEY non definie'); return; }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + RESEND_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
  });
  const data = await res.json();
  if (!res.ok) console.error('Resend error:', JSON.stringify(data));
  return data;
}

async function sendReminders() {
  console.log('[' + new Date().toISOString() + '] Verification rappels...');
  try {
    const now = new Date();
    const in48h = new Date(now.getTime() + 48 * 60 * 60 * 1000);
    const in47h = new Date(now.getTime() + 47 * 60 * 60 * 1000);

    const upcomingMatchdays = db.prepare(
      "SELECT DISTINCT matchday FROM matches WHERE status = 'scheduled' AND kickoff >= ? AND kickoff <= ?"
    ).all(in47h.toISOString(), in48h.toISOString());

    if (upcomingMatchdays.length === 0) {
      console.log('   Aucune journee dans les 47-48h');
      return;
    }

    for (const row of upcomingMatchdays) {
      const matchday = row.matchday;
      const matchesOfDay = db.prepare("SELECT * FROM matches WHERE matchday = ? AND status = 'scheduled'").all(matchday);
      const users = db.prepare("SELECT id, username, email FROM users WHERE role = 'user' AND email IS NOT NULL").all();

      for (const user of users) {
        const pronos = db.prepare(
          "SELECT COUNT(*) as n FROM predictions p JOIN matches m ON m.id = p.match_id WHERE p.user_id = ? AND m.matchday = ?"
        ).get(user.id, matchday);

        const missing = matchesOfDay.length - (pronos ? pronos.n : 0);
        if (missing <= 0) continue;

        await sendEmail(
          user.email,
          'Rappel - Journee ' + matchday + ' de Ligue 1 dans 48h !',
          '<div style="font-family:sans-serif;max-width:500px;margin:0 auto;background:#0d0d0d;color:#f2ead8;padding:24px;"><h1 style="color:#e30613;">SRFC Pronos L1</h1><p>Bonjour ' + user.username + '</p><p>La Journee ' + matchday + ' commence dans 48h. Il te reste ' + missing + ' pronostic(s) a saisir.</p><a href="https://pronos-l1-production.up.railway.app" style="background:#e30613;color:#0d0d0d;padding:12px 28px;border-radius:4px;text-decoration:none;font-weight:600;display:inline-block;margin-top:16px;">Pronostiquer</a></div>'
        );
        console.log('   Email envoye a ' + user.username);
      }
    }
  } catch(err) {
    console.error('Erreur sendReminders :', err.message);
  }
}

cron.schedule('0 * * * *', sendReminders, { timezone: 'Europe/Paris' });

module.exports = { sendReminders };