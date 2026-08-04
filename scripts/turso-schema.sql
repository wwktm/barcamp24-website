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
  phone            TEXT,                         -- submitter contact (PRIVATE — never render publicly)
  status           TEXT NOT NULL DEFAULT 'pending'  -- pending | accepted | rejected
);

CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals (status);

-- `phone` arrived after the first submissions, so it has to be added to a table
-- that already exists. Rows from before it keep NULL, which is what marks them
-- as needing to be chased up by hand. Re-running is safe: the migration script
-- treats "duplicate column" as already applied.
ALTER TABLE proposals ADD COLUMN phone TEXT;

-- Uploaded speaker photos, kept out of `proposals` so the row stays small:
-- the build reads every accepted proposal, and dragging megabytes of image
-- through that query would be paid for on every deploy.
CREATE TABLE IF NOT EXISTS speaker_photos (
  proposal_id   INTEGER NOT NULL REFERENCES proposals (id) ON DELETE CASCADE,
  speaker_index INTEGER NOT NULL,               -- position in proposals.speakers
  mime          TEXT NOT NULL,                  -- image/jpeg | image/png | image/webp
  bytes         BLOB NOT NULL,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (proposal_id, speaker_index)
);
