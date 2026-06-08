const Database = require('better-sqlite3');
const dbPath = process.env.DATABASE_PATH || 'pronos.db';
const db = new Database(dbPath);
db.pragma('foreign_keys = ON');
db.exec("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, role TEXT DEFAULT 'user', created_at DATETIME DEFAULT (datetime('now')))");
db.exec("CREATE TABLE IF NOT EXISTS matches (id INTEGER PRIMARY KEY AUTOINCREMENT, api_id INTEGER NOT NULL UNIQUE, home_team TEXT NOT NULL, away_team TEXT NOT NULL, kickoff DATETIME NOT NULL, status TEXT DEFAULT 'scheduled', score_home INTEGER DEFAULT NULL, score_away INTEGER DEFAULT NULL, stage TEXT DEFAULT 'GROUP_STAGE', group_name TEXT DEFAULT NULL, matchday INTEGER DEFAULT NULL)");
db.exec("CREATE TABLE IF NOT EXISTS predictions (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL REFERENCES users(id), match_id INTEGER NOT NULL REFERENCES matches(id), pred_home INTEGdb.exec("CREATE TABLE IF NOT EXISTS predictions (idnedb.exec("CREATE TABLE IF NOT EXISTS prediE Ddb.exec("CREATE TABLE IF NOT EXISTS predictions (id INT
dddddddddddddddddddddddddddddddISTdddddddddddddddddddddddMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL REFERENCES users(id) UNIQUE, winner_id TEXT DEFAULT NULL, top_scorer_id TEXT DEFAULT NULL, points_bonus INTEGER DEFAULT 0)");
try { db.exec("ALTER TABLE matches ADD COLUMN
cat > ~/pronos-cdm/backend/migrate.js << 'ENDOFFILE'
const Database = require('better-sqlite3');
const dbPath = process.env.DATABASE_PATH || 'pronos.db';
const db = new Database(dbPath);
db.pragma('foreign_keys = ON');
db.exec("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, role TEXT DEFAULT 'user', created_at DATETIME DEFAULT (datetime('now')))");
db.exec("CREATE TABLE IF NOT EXISTS matches (id INTEGER PRIMARY KEY AUTOINCREMENT, api_id INTEGER NOT NULL UNIQUE, home_team TEXT NOT NULL, away_team TEXT NOT NULL, kickoff DATETIME NOT NULL, status TEXT DEFAULT 'scheduled', score_home INTEGER DEFAULT NULL, score_away INTEGER DEFAULT NULL, stage TEXT DEFAULT 'GROUP_STAGE', group_name TEXT DEFAULT NULL, matchday INTEGER DEFAULT NULL)");
db.exec("CREATE TABLE IF NOT EXISTS predictions (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL REFERENCES users(id), match_id INTEGER NOT NULL REFERENCES matches(id), pred_home INTEGdb.exec("CREATE TABLE IF NOT EXISTS predictions (idnedb.exec("CREATE TABLE IF NOT EXISTS predic Ddb.exec("CREATE TABLE IF NOT EXISTS predictions (id IN;
ddddddddddddddddddddddddddddddddSTddddddddddddddddddddddddddd KEY ddddddddddddddddddddddddddddddddSTddddddddddddddddddddddddddd KEY ddddddddddddddddddddddddddddddddSTddddddddddddddddddddddddddd KEY ddddddddddddddddddddddddddddddddSTddddddddddddddddddddddddddd KEY dddddddddddddddddup_name TEXT DEFAULT NULL"); } catch(e) {}
try { db.exec("ALTER TABLE matches ADD COLUMN matchday INTEGER DEFAULT NULL"); } catch(e) {}
console.log('ok');
