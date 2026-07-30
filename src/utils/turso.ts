import { createClient, type Client } from '@libsql/client';

const url = import.meta.env.TURSO_DATABASE_URL ?? process.env.TURSO_DATABASE_URL;
const authToken = import.meta.env.TURSO_AUTH_TOKEN ?? process.env.TURSO_AUTH_TOKEN;

let client: Client | null = null;

/**
 * Returns a Turso (libSQL) client, or `null` if the env vars are not
 * configured. Callers must handle `null` (fail-soft) so a missing secret
 * can never crash the build or the site — it just means DB access no-ops.
 * Server-only: never import this from a client component/island.
 */
export function getTurso(): Client | null {
  if (!url || !authToken) return null;
  if (!client) client = createClient({ url, authToken });
  return client;
}
