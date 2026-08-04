/**
 * Applies scripts/turso-schema.sql to the database in .env.
 *
 *   npm run migrate            apply
 *   npm run migrate -- --dry   print the statements without running them
 *
 * Every statement in the schema is CREATE ... IF NOT EXISTS, so this is safe to
 * re-run. It exists so schema changes can be applied without the Turso CLI.
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
  const url = env.TURSO_DATABASE_URL;
  const authToken = env.TURSO_AUTH_TOKEN;
  if (!url || !authToken) {
    console.error('Missing TURSO_DATABASE_URL / TURSO_AUTH_TOKEN (put them in .env).');
    process.exit(1);
  }
  return createClient({ url, authToken });
}

/** Splits on `;` at end of statement, dropping comment-only and blank chunks. */
function statements(sql: string): string[] {
  return sql
    .split(';')
    .map((s) =>
      s
        .split('\n')
        .filter((l) => !l.trim().startsWith('--'))
        .join('\n')
        .trim()
    )
    .filter(Boolean);
}

const dry = process.argv.includes('--dry');
const sql = readFileSync('scripts/turso-schema.sql', 'utf8');
const stmts = statements(sql);

if (dry) {
  console.log(`\n  ${stmts.length} statement(s), not applied:\n`);
  stmts.forEach((s) => console.log(`  ${s.split('\n')[0]}…`));
  console.log('');
  process.exit(0);
}

const db = connect();
for (const stmt of stmts) {
  const head = stmt.split('\n')[0];
  try {
    await db.execute(stmt);
    console.log(`  ok    ${head}…`);
  } catch (err: unknown) {
    // ALTER TABLE ADD COLUMN has no IF NOT EXISTS, so a column that is already
    // there is the normal outcome of re-running, not a failure.
    const msg = err instanceof Error ? err.message : String(err);
    if (/duplicate column name/i.test(msg)) {
      console.log(`  skip  ${head}… (already applied)`);
      continue;
    }
    throw err;
  }
}

const { rows } = await db.execute(
  "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
);
console.log(`\n  tables: ${rows.map((r) => r.name).join(', ')}\n`);
