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
    const in48h = new Date(now.getTime() + 48 * 60 *    const in48h = new Date(now.getTime() + 48 * 60 *    const60    const in48h = new Date(now.getTitchdays = db.prepare(
      "SELECT DI      "SELECT DI      "SELECT DI      "SELECT DI      "SELECT DI      "SELECT DI      "SEL
    ).all(in47h.toISOString(), in48h.toISOString());

    if (upcomingMatchdays.length === 0) {
                                                  8h                                                  8h                        nst matchday = row.matchday;
      const matchesOfDay = db.prep      const matche matches WHERE matchday = ? AND status = 'scheduled'").all(matchday);
      const users = db.prepare("SELECT id, username, email FROM users WHERE role = 'user' AND email IS       const users = db.prepare(e.      const users = db.prepare("SELECT id, username, email FROM use     for (const user of users) {
        const pronos        const pronos        const pronos        const pronos        const phe       m        const pronosRE p.use        const pronos        const pronos        const pronos        const pronos        const phe       m        const pronosRE p.use        const pronos        const pro

                                                                                                         ns 48h !',
          '<div style="font-family:sans-serif;          '<div style="font-family:sansd:#0d0d0d;color:#f2ead8;padding:24px;border-radius:8px;"><div style="text-align:center;margin-bottom:20px;"><img src="https://crests.football-data.org/529.png" width="60" alt="SRFC"/><h1 style="color:#e30613;">SRFC Pronos L1</h1></div><p>Bonjour <strong>' + user.username + '</stron          '<div style="font-family:sans-serif;          '<div style="font-family:sansd:#0d0d0d;color:#f2ead8;padding:24px;border-radius:8px;"><div style="text-align:center;margin-bottom:20px;"><img src="https://crests.football-data.orno          '<div style="font-family:sans-serif;          '<div style="font-family:sansd:#0d0d0d;color:#f2ead8;padding:24px;border-radius:8px;"><div style="text-align:center;margin-bottom:20px;"><img src="https://crests.football-data.org/529.png" width="60" alt="SRFC"/><h1 style="color:#e30613;">SRFC Pr></          '<div style="font-family:sans-serif;          '<div style="font-family:sansd:#0d0d0d;color:#f2ead8;paddi}
    }
  } catch(err) {
    console.error('Erreur sendReminders :', err.message);
  }
}

cron.schedule('0 * * * *', sendReminders, { timezone: 'Europe/Paris' });

module.exports = { sendReminders };
