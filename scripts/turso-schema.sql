-- BarCamp call-for-speakers — Turso (libSQL/SQLite) schema
-- Apply with:  turso db shell barcamp < scripts/turso-schema.sql

CREATE TABLE IF NOT EXISTS proposals (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at       TEXT NOT NULL DEFAULT (datetime('now')),
  title            TEXT NOT NULL,
  description      TEXT NOT NULL,
  session_category TEXT,
  duration         TEXT,                        -- 'regular' | 'lightning'
  tags             TEXT NOT NULL DEFAULT '[]',  -- JSON array (SQLite has no array type)
  speakers         TEXT NOT NULL DEFAULT '[]',  -- JSON array of {name, photoUrl, profileLink, introduction}
  email            TEXT,                         -- submitter contact (PRIVATE — never render publicly)
  status           TEXT NOT NULL DEFAULT 'pending'  -- pending | accepted | rejected
);

CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals (status);
