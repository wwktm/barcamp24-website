/**
 * Proposal review CLI — list submissions and set whether a speaker is coming.
 * Accepted proposals become the speakers shown on the site (next build).
 *
 *   npm run proposals                      list everything
 *   npm run proposals -- list pending      list one status (pending|accepted|rejected)
 *   npm run proposals -- show 3            full detail for one proposal
 *   npm run proposals -- accept 3 7        they're coming -> shown on the site
 *   npm run proposals -- reject 4          not coming -> hidden
 *   npm run proposals -- reset 5           back to pending
 *   npm run proposals -- export [file]     write accepted ones to JSON (no emails)
 *
 * Reads TURSO_DATABASE_URL / TURSO_AUTH_TOKEN from .env.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createClient, type Client } from '@libsql/client';

const STATUSES = ['pending', 'accepted', 'rejected'] as const;
type Status = (typeof STATUSES)[number];

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

const speakerNames = (raw: unknown): string => {
  try {
    const arr = JSON.parse(String(raw ?? '[]'));
    return Array.isArray(arr) ? arr.map((s) => s?.name).filter(Boolean).join(', ') : '';
  } catch {
    return '';
  }
};

const mark = (s: string) => (s === 'accepted' ? '✓' : s === 'rejected' ? '✗' : '·');
const clip = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1) + '…' : s).padEnd(n);

async function list(db: Client, status?: string) {
  if (status && !STATUSES.includes(status as Status)) {
    console.error(`Unknown status "${status}". Use: ${STATUSES.join(' | ')}`);
    process.exit(1);
  }
  const { rows } = status
    ? await db.execute({
        sql: 'SELECT id, title, speakers, session_category, duration, status, created_at FROM proposals WHERE status = ? ORDER BY id',
        args: [status],
      })
    : await db.execute(
        'SELECT id, title, speakers, session_category, duration, status, created_at FROM proposals ORDER BY id'
      );

  if (!rows.length) {
    console.log(status ? `No ${status} proposals.` : 'No proposals yet.');
    return;
  }

  console.log('');
  console.log(`  ${'ID'.padEnd(4)}${'S'.padEnd(3)}${clip('TITLE', 46)}${clip('SPEAKER(S)', 24)}${'LENGTH'}`);
  console.log('  ' + '─'.repeat(86));
  for (const r of rows) {
    const s = String(r.status);
    console.log(
      `  ${String(r.id).padEnd(4)}${mark(s).padEnd(3)}${clip(String(r.title ?? ''), 46)}${clip(speakerNames(r.speakers), 24)}${String(r.duration ?? '')}`
    );
  }

  const counts = await db.execute('SELECT status, count(*) AS n FROM proposals GROUP BY status');
  const summary = counts.rows.map((r) => `${r.status}: ${r.n}`).join('   ');
  console.log('  ' + '─'.repeat(86));
  console.log(`  ${summary}      (✓ accepted, ✗ rejected, · pending)`);
  console.log('');
}

async function show(db: Client, id: string) {
  const { rows } = await db.execute({ sql: 'SELECT * FROM proposals WHERE id = ?', args: [id] });
  if (!rows.length) {
    console.error(`No proposal with id ${id}.`);
    process.exit(1);
  }
  const r = rows[0] as Record<string, unknown>;
  console.log('');
  console.log(`  #${r.id}  [${r.status}]  submitted ${r.created_at}`);
  console.log(`  ${'─'.repeat(70)}`);
  console.log(`  Title      ${r.title}`);
  console.log(`  Category   ${r.session_category ?? '—'}`);
  console.log(`  Length     ${r.duration ?? '—'}`);
  console.log(`  Tags       ${(() => { try { return JSON.parse(String(r.tags ?? '[]')).join(', '); } catch { return String(r.tags ?? ''); } })()}`);
  console.log(`  Contact    ${r.email ?? '—'}`);
  console.log('');
  console.log(`  Description`);
  console.log(
    String(r.description ?? '')
      .split('\n')
      .map((l) => '    ' + l)
      .join('\n')
  );
  console.log('');
  console.log('  Speakers');
  try {
    const arr = JSON.parse(String(r.speakers ?? '[]'));
    for (const sp of Array.isArray(arr) ? arr : []) {
      console.log(`    • ${sp?.name || '(no name)'}`);
      if (sp?.profileLink) console.log(`      profile: ${sp.profileLink}`);
      if (sp?.photoUrl) console.log(`      photo:   ${sp.photoUrl}`);
      if (sp?.introduction) console.log(`      intro:   ${sp.introduction}`);
    }
  } catch {
    console.log('    (unparseable)');
  }
  console.log('');
}

async function setStatus(db: Client, status: Status, ids: string[]) {
  if (!ids.length) {
    console.error(`Which proposal? e.g. npm run proposals -- ${status === 'pending' ? 'reset' : status} 3`);
    process.exit(1);
  }
  for (const id of ids) {
    const found = await db.execute({ sql: 'SELECT title FROM proposals WHERE id = ?', args: [id] });
    if (!found.rows.length) {
      console.log(`  ! no proposal with id ${id} — skipped`);
      continue;
    }
    await db.execute({ sql: 'UPDATE proposals SET status = ? WHERE id = ?', args: [status, id] });
    console.log(`  ${mark(status)} #${id} → ${status}   ${found.rows[0].title}`);
  }
  if (status === 'accepted') {
    console.log('\n  Accepted proposals appear on the site on the next build/deploy.');
  }
}

async function exportAccepted(db: Client, file = 'accepted-sessions.json') {
  const { rows } = await db.execute(
    "SELECT id, title, description, session_category, duration, tags, speakers, created_at FROM proposals WHERE status = 'accepted' ORDER BY created_at"
  );
  // email is deliberately not selected — exports are public/archive data
  const sessions = rows.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    category: r.session_category,
    duration: r.duration,
    tags: (() => { try { return JSON.parse(String(r.tags ?? '[]')); } catch { return []; } })(),
    speakers: (() => { try { return JSON.parse(String(r.speakers ?? '[]')); } catch { return []; } })(),
    submitted_at: r.created_at,
  }));
  writeFileSync(file, JSON.stringify(sessions, null, 2) + '\n');
  console.log(`  exported ${sessions.length} accepted session(s) → ${file} (no emails included)`);
}

const [cmd = 'list', ...args] = process.argv.slice(2);
const db = connect();

switch (cmd) {
  case 'list':
    await list(db, args[0]);
    break;
  case 'show':
    await show(db, args[0]);
    break;
  case 'accept':
    await setStatus(db, 'accepted', args);
    break;
  case 'reject':
    await setStatus(db, 'rejected', args);
    break;
  case 'reset':
    await setStatus(db, 'pending', args);
    break;
  case 'export':
    await exportAccepted(db, args[0]);
    break;
  default:
    console.error(`Unknown command "${cmd}". Use: list | show | accept | reject | reset | export`);
    process.exit(1);
}
