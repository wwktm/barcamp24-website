/**
 * Writes uploaded speaker photos out of Turso and into src/images/speakers/,
 * so Astro can optimize them at build time and the CDN can serve them. Runs
 * before `astro build`.
 *
 * The homepage is prerendered, so it cannot read BLOBs at request time. Doing
 * it here means a visitor costs no function call and no row read.
 *
 * Fail-soft on purpose: a missing or unreachable database must never break the
 * build. Speakers just fall back to their initials, exactly as before.
 */
import { readFileSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createClient } from '@libsql/client';

const OUT_DIR = join('src', 'images', 'speakers');

const EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

function loadEnv(): Record<string, string> {
  const out: Record<string, string> = { ...(process.env as Record<string, string>) };
  if (!existsSync('.env')) return out;
  for (const line of readFileSync('.env', 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#') || !t.includes('=')) continue;
    const i = t.indexOf('=');
    const key = t.slice(0, i).trim();
    if (!out[key]) out[key] = t.slice(i + 1).trim().replace(/^["']|["']$/g, '');
  }
  return out;
}

// Rebuilt from scratch every time, so a rejected proposal's photo cannot linger
// in the output of a later build.
rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(OUT_DIR, { recursive: true });

const env = loadEnv();
if (!env.TURSO_DATABASE_URL || !env.TURSO_AUTH_TOKEN) {
  console.log('  speaker photos: Turso not configured, skipping');
  process.exit(0);
}

try {
  const db = createClient({
    url: env.TURSO_DATABASE_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  });

  const { rows } = await db.execute(`
    SELECT p.proposal_id, p.speaker_index, p.mime, p.bytes
    FROM speaker_photos p
    JOIN proposals ON proposals.id = p.proposal_id
    WHERE proposals.status = 'accepted'
    ORDER BY p.proposal_id, p.speaker_index
  `);

  let written = 0;
  for (const row of rows) {
    const ext = EXTENSIONS[String(row.mime)];
    if (!ext) {
      console.log(`  speaker photos: skipping ${row.proposal_id}/${row.speaker_index}, mime ${row.mime}`);
      continue;
    }
    const bytes = row.bytes as unknown as ArrayBuffer | Uint8Array;
    const name = `${row.proposal_id}-${row.speaker_index}.${ext}`;
    writeFileSync(join(OUT_DIR, name), Buffer.from(bytes as ArrayBuffer));
    written++;
  }

  console.log(`  speaker photos: wrote ${written} file(s) to ${OUT_DIR}`);
} catch (err: unknown) {
  console.log(
    `  speaker photos: skipping, database unreachable — ${err instanceof Error ? err.message : err}`
  );
}
