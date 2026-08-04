/**
 * One-off: rewrite `"photoUrl": ""` to null inside proposals.speakers.
 *
 *   npm run normalize-photos -- --dry    show what would change
 *   npm run normalize-photos             apply
 *
 * Submissions made before the photo became required stored an empty string for
 * a missing photo. Null says "no photo" unambiguously, and it keeps those rows
 * distinguishable from a submission that genuinely had one. Rendering is
 * unaffected either way — the card falls back to initials for both.
 *
 * Safe to delete once it has been run.
 */
import { readFileSync, existsSync } from 'node:fs';
import { createClient, type Client } from '@libsql/client';

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

function connect(): Client {
  const env = loadEnv();
  if (!env.TURSO_DATABASE_URL || !env.TURSO_AUTH_TOKEN) {
    console.error('Missing TURSO_DATABASE_URL / TURSO_AUTH_TOKEN (put them in .env).');
    process.exit(1);
  }
  return createClient({ url: env.TURSO_DATABASE_URL, authToken: env.TURSO_AUTH_TOKEN });
}

const dry = process.argv.includes('--dry');
const db = connect();

const { rows } = await db.execute('SELECT id, speakers FROM proposals ORDER BY id');

let changed = 0;
for (const row of rows) {
  let speakers: unknown;
  try {
    speakers = JSON.parse(String(row.speakers ?? '[]'));
  } catch {
    console.log(`  #${row.id}  unparseable speakers JSON — left alone`);
    continue;
  }
  if (!Array.isArray(speakers)) continue;

  let touched = false;
  const next = speakers.map((s: Record<string, unknown>) => {
    if (s && typeof s === 'object' && s.photoUrl === '') {
      touched = true;
      return { ...s, photoUrl: null };
    }
    return s;
  });
  if (!touched) continue;

  changed++;
  const names = next.map((s: Record<string, unknown>) => s?.name).join(', ');
  console.log(`  ${dry ? 'would fix' : 'fixed   '} #${row.id}  ${names}`);
  if (!dry) {
    await db.execute({
      sql: 'UPDATE proposals SET speakers = ? WHERE id = ?',
      args: [JSON.stringify(next), row.id as number],
    });
  }
}

console.log(
  `\n  ${changed} of ${rows.length} proposal(s) ${dry ? 'would be' : 'were'} normalized.\n`
);
