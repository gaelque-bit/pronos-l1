// database.js
// Ce fichier crée la connexion à SQLite et initialise toutes les tables.

const Database = require('better-sqlite3');
const db = new Database('pronos.db');

// Active les clés étrangères (désactivé par défaut dans SQLite)
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    username      TEXT    NOT NULL UNIQUE,
    password_hash TEXT    NOT NULL,
    role          TEXT    DEFAULT 'user',
    created_at    DATETIME DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS matches (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    api_id      INTEGER NOT NULL UNIQUE,
    home_team   TEXT    NOT NULL,
    away_team   TEXT    NOT NULL,
    kickoff     DATETIME NOT NULL,
    status      TEXT    DEFAULT 'scheduled',
    score_home  INTEGER DEFAULT NULL,
    score_away  INTEGER DEFAULT NULL,
    stage       TEXT    DEFAULT 'GROUP_STAGE'
  );

  CREATE TABLE IF NOT EXISTS predictions (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id       INTEGER NOT NULL REFERENCES users(id),
    match_id      INTEGER NOT NULL REFERENCES matches(id),
    pred_home     INTEGER NOT NULL,
    pred_away     INTEGER NOT NULL,
    points_earned INTEGER DEFAULT 0,
    submitted_at  DATETIME DEFAULT (datetime('now')),
    UNIQUE(user_id, match_id)
  );

  CREATE TABLE IF NOT EXISTS bonus (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id       INTEGER NOT NULL REFERENCES users(id) UNIQUE,
    winner_id     TEXT    DEFAULT NULL,
    top_scorer_id TEXT    DEFAULT NULL,
    points_bonus  INTEGER DEFAULT 0
  );
`);

console.log('✅ Base de données prête');

module.exports = db;