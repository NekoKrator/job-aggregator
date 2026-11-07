-- Telegram users of the bot
CREATE TABLE users (
  id INTEGER PRIMARY KEY,                  -- Telegram user id
  username TEXT,
  first_name TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Job sites we scrape
CREATE TABLE platforms (
  id TEXT PRIMARY KEY,                     -- e.g. 'rabota_md'
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  enabled INTEGER NOT NULL DEFAULT 1
);

-- Search tags each user follows
CREATE TABLE user_tags (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,                       -- stored lowercase
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (user_id, tag)
);

-- Every vacancy ever seen; never deleted, kept for statistics
CREATE TABLE vacancies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  platform_id TEXT NOT NULL REFERENCES platforms(id),
  external_id TEXT NOT NULL,               -- id on the platform
  title TEXT NOT NULL,
  company TEXT,
  city TEXT,
  url TEXT NOT NULL,
  first_seen TEXT NOT NULL DEFAULT (datetime('now')),
  last_seen TEXT NOT NULL DEFAULT (datetime('now')),
  removed_at TEXT,                         -- NULL while the vacancy is still live
  UNIQUE (platform_id, external_id)
);

CREATE INDEX vacancies_live ON vacancies (removed_at);

-- Which tags a vacancy was found by
CREATE TABLE vacancy_tags (
  vacancy_id INTEGER NOT NULL REFERENCES vacancies(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  PRIMARY KEY (vacancy_id, tag)
);

CREATE INDEX vacancy_tags_tag ON vacancy_tags (tag);

INSERT INTO platforms (id, name, url) VALUES ('rabota_md', 'rabota.md', 'https://www.rabota.md');
