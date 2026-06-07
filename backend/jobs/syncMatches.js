// jobs/syncMatches.js
const cron  = require('node-cron');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const db    = require('../database');

const API_KEY     = process.env.FOOTBALL_API_KEY;
const COMPETITION = 'WC';
const API_BASE    = 'https://api.football-data.org/v4';

async function syncMatches() {
  console.log(`[${new Date().toISOString()}] 🔄 Synchronisation des matchs...`);

  if (!API_KEY) {
    console.log('⚠️  Clé API non configurée — sync ignorée.');
    return;
  }

  try {
    const response = await fetch(
      `${API_BASE}/competitions/${COMPETITION}/matches?status=SCHEDULED,IN_PLAY,FINISHED`,
      { headers: { 'X-Auth-Token': API_KEY } }
    );

    if (!response.ok) {
      const err = await response.json();
      console.error('❌ Erreur API :', err.message);
      return;
    }

    const { matches } = await response.json();
    console.log(`   → ${matches.length} matchs reçus`);

    const upsert = db.prepare(`
      INSERT INTO matches (api_id, home_team, away_team, kickoff, status, score_home, score_away, stage, group_name, matchday)
      VALUES (@api_id, @home_team, @away_team, @kickoff, @status, @score_home, @score_away, @stage, @group_name, @matchday)
      ON CONFLICT(api_id) DO UPDATE SET
        status     = excluded.status,
        score_home = excluded.score_home,
        score_away = excluded.score_away,
        stage      = excluded.stage,
        group_name = excluded.group_name,
        matchday   = excluded.matchday
    `);

    const insertAll = db.transaction((matches) => {
      for (const match of matches) {
        let status;
        switch (match.status) {
          case 'SCHEDULED': case 'TIMED':  status = 'scheduled'; break;
          case 'IN_PLAY':   case 'PAUSED': status = 'live';      break;
          case 'FINISHED':                 status = 'finished';  break;
          default:                         status = 'scheduled';
        }

        // On ignore les matchs sans équipes
        if (!match.homeTeam?.name && !match.homeTeam?.shortName) continue;

        upsert.run({
          api_id:     match.id,
          home_team:  match.homeTeam.shortName || match.homeTeam.name,
          away_team:  match.awayTeam.shortName || match.awayTeam.name,
          kickoff:    match.utcDate,
          status,
          score_home: match.score?.regularTime?.home ?? match.score?.fullTime?.home ?? null,
          score_away: match.score?.regularTime?.away ?? match.score?.fullTime?.away ?? null,
          stage:      match.stage,
          group_name: match.group || null,
          matchday:   match.matchday || null,
        });
      }         // ← accolade fermante du for
    });         // ← accolade fermante du db.transaction

    insertAll(matches);
    console.log('   ✅ Base de données mise à jour');

  } catch(err) {
    console.error('❌ Erreur sync :', err.message);
  }
}

// Toutes les 15 min entre 16h et 02h
cron.schedule('*/15 16-23 * * *', syncMatches, { timezone: 'Europe/Paris' });
cron.schedule('*/15 0-2 * * *',   syncMatches, { timezone: 'Europe/Paris' });

// Toutes les 3h le reste du temps
cron.schedule('0 */3 3-15 * * *', syncMatches, { timezone: 'Europe/Paris' });

module.exports = { syncMatches };