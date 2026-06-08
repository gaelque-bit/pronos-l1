const Database = require('better-sqlite3');
const path = process.env.DATABASE_PATH || 'pronos.db';
const db = new Database(path);
db.pragma('foreign_keys = ON');
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS matches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    api_id INTEGER NOT NULL UNIQUE,
    home_team TEXT NOT NULL,
    away_team TEXT NOT NULL,
    kickoff DATETIME NOT NULL,
    status TEXT DEFAULT 'scheduled',
    score_home INTEGER DEFAULT NULL,
    score_away INTEGER DEFAULT NULL,
    stage TEXT DEFAULT 'GROUP_STAGE',
    group_name TEXT DEFAULT NULL,
    matchday INTEGER DEFAULT NULL
  );
  CREATE TABLE IF NOT EXISTS predictions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    match_id INTEGER NOT NULL REFERENCES matches(id),
                                            y                                             y       0,
                          DEFAU                          DEFQUE(user_id,                           DEFAU  NOT                           DEFAU         Y                           DEFAEGER                           DE) UNI                         EFAUL                          DEFAU   AULT NULL,
    points    points    points    points    poi {    points    points    points    points group_name TEXT DEFAULT NULL"); } catch(e) {}
try { db.exec("ALTER TABLE matches ADD COLUMN mattry { db.exec("ALTER TABLE ma }try { db.exec("ALTER TABLE ma);
