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
 *   npm run proposals -- export [file]     accepted ones -> JSON + their photos
 *
 * Reads TURSO_DATABASE_URL / TURSO_AUTH_TOKEN from .env.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
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
  const uploads = await db.execute({
    sql: 'SELECT speaker_index, mime, length(bytes) AS n FROM speaker_photos WHERE proposal_id = ?',
    args: [id],
  });
  const uploadFor = new Map(uploads.rows.map((u) => [Number(u.speaker_index), u]));

  console.log('');
  console.log('  Speakers');
  try {
    const arr = JSON.parse(String(r.speakers ?? '[]'));
    (Array.isArray(arr) ? arr : []).forEach((sp, i) => {
      console.log(`    • ${sp?.name || '(no name)'}`);
      if (sp?.profileLink) console.log(`      profile: ${sp.profileLink}`);
      if (sp?.photoUrl) console.log(`      photo:   ${sp.photoUrl}`);
      const up = uploadFor.get(i);
      if (up) console.log(`      upload:  ${up.mime}, ${humanSize(Number(up.n))}`);
      if (sp?.introduction) console.log(`      intro:   ${sp.introduction}`);
    });
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

/** Photos come back byte-for-byte as submitted, so the extension follows the stored mime. */
const PHOTO_EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);

const humanSize = (bytes: number) => {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
};

/** Pulls a photo the submitter linked to instead of uploading. */
async function fetchRemote(url: string): Promise<{ mime: string; bytes: Buffer } | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(15_000) });
    if (!res.ok) {
      console.log(`  ! ${url} — HTTP ${res.status}, skipped`);
      return null;
    }
    const mime = (res.headers.get('content-type') ?? '').split(';')[0].trim();
    if (!PHOTO_EXTENSIONS[mime]) {
      console.log(`  ! ${url} — served ${mime || 'no content-type'}, skipped`);
      return null;
    }
    return { mime, bytes: Buffer.from(await res.arrayBuffer()) };
  } catch (err) {
    console.log(`  ! ${url} — ${err instanceof Error ? err.message : err}, skipped`);
    return null;
  }
}

/**
 * Writes the accepted speakers' photos into `dir`. Uploads come out of the
 * database byte-for-byte; a speaker who linked to one instead has it fetched,
 * so the export is the whole lineup rather than only the half that uploaded.
 * Returns "<proposalId>-<speakerIndex>" -> filename.
 */
async function writePhotos(db: Client, dir: string): Promise<Map<string, string>> {
  const accepted = await db.execute(
    "SELECT id, speakers FROM proposals WHERE status = 'accepted' ORDER BY id"
  );
  const uploads = await db.execute(
    `SELECT sp.proposal_id, sp.speaker_index, sp.mime, sp.bytes
     FROM speaker_photos sp
     JOIN proposals p ON p.id = sp.proposal_id
     WHERE p.status = 'accepted'`
  );
  const uploadFor = new Map(
    uploads.rows.map((u) => [`${u.proposal_id}-${u.speaker_index}`, u])
  );

  const written = new Map<string, string>();

  // Files are named after the speaker, since that is what makes them useful to
  // hand around. Two speakers can share a name though, and everything lands in
  // one folder, so a repeat gets a counter rather than quietly overwriting.
  const taken = new Set<string>();
  const uniqueName = (base: string, ext: string) => {
    let candidate = `${base}.${ext}`;
    for (let n = 2; taken.has(candidate); n++) candidate = `${base}-${n}.${ext}`;
    taken.add(candidate);
    return candidate;
  };

  const save = (key: string, speakerName: string, mime: string, bytes: Buffer, note: string) => {
    const ext = PHOTO_EXTENSIONS[mime];
    if (!ext) return;
    mkdirSync(dir, { recursive: true });
    const base = uniqueName(slug(speakerName) || 'speaker', ext);
    writeFileSync(join(dir, base), bytes);
    written.set(key, base);
    console.log(`  saved ${join(dir, base)}  (${mime}, ${humanSize(bytes.length)}, ${note})`);
  };

  for (const row of accepted.rows) {
    let speakers: Array<Record<string, unknown>> = [];
    try {
      const parsed = JSON.parse(String(row.speakers ?? '[]'));
      if (Array.isArray(parsed)) speakers = parsed;
    } catch {
      continue;
    }

    for (const [i, sp] of speakers.entries()) {
      const key = `${row.id}-${i}`;
      const name = String(sp?.name ?? '');

      const up = uploadFor.get(key);
      if (up) {
        save(key, name, String(up.mime), Buffer.from(up.bytes as unknown as ArrayBuffer), 'uploaded');
        continue;
      }

      const url = String(sp?.photoUrl ?? '').trim();
      if (!url) continue;
      const remote = await fetchRemote(url);
      if (remote) save(key, name, remote.mime, remote.bytes, 'from their link');
    }
  }

  return written;
}

async function exportAccepted(db: Client, file = 'accepted-sessions.json') {
  const { rows } = await db.execute(
    "SELECT id, title, description, session_category, duration, tags, speakers, created_at FROM proposals WHERE status = 'accepted' ORDER BY created_at"
  );

  // Photos land in a `photos/` folder beside the JSON, and each speaker points
  // at their file, so the export is self-contained: hand over both and nothing
  // has to be fetched from the database again.
  const photoDir = join(dirname(file), 'photos');
  console.log('');
  const photos = await writePhotos(db, photoDir);

  // email is deliberately not selected — exports are public/archive data
  const sessions = rows.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    category: r.session_category,
    duration: r.duration,
    tags: (() => { try { return JSON.parse(String(r.tags ?? '[]')); } catch { return []; } })(),
    speakers: (() => {
      try {
        const arr = JSON.parse(String(r.speakers ?? '[]'));
        return (Array.isArray(arr) ? arr : []).map((sp, i) => ({
          ...sp,
          photoFile: photos.get(`${r.id}-${i}`) ?? null,
        }));
      } catch {
        return [];
      }
    })(),
    submitted_at: r.created_at,
  }));
  writeFileSync(file, JSON.stringify(sessions, null, 2) + '\n');
  console.log(
    `\n  exported ${sessions.length} accepted session(s) → ${file} (no emails included)`
  );
  console.log(
    photos.size
      ? `  ${photos.size} photo(s) → ${photoDir}/, referenced as speakers[].photoFile\n`
      : '  no uploaded photos to include\n'
  );
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
