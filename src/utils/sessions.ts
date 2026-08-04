import type { ImageMetadata } from 'astro';
import { getTurso } from './turso';
import { announcement } from '../content/announcement';

/**
 * Photos uploaded through the proposal form, written to disk before the build
 * by scripts/materialize-photos.ts and named <proposalId>-<speakerIndex>.<ext>.
 * Going through Vite here is what earns them Astro's image optimization.
 */
const uploaded = import.meta.glob<{ default: ImageMetadata }>(
  '../images/speakers/*.{jpg,jpeg,png,webp}',
  { eager: true }
);

const uploadedPhoto = (proposalId: unknown, speakerIndex: number): ImageMetadata | undefined => {
  const stem = `${proposalId}-${speakerIndex}.`;
  const hit = Object.entries(uploaded).find(([path]) =>
    (path.split('/').pop() ?? '').startsWith(stem)
  );
  return hit?.[1].default;
};

/**
 * A speaker as rendered on the site. `photo` (a local, optimized asset) wins;
 * `photoUrl` is the URL the submitter gave and is only a fallback, since remote
 * URLs rot. Uploads always arrive as `photo`.
 */
export interface DisplaySpeaker {
  name: string;
  title: string;
  tagline: string;
  category?: string;
  duration?: string;
  link?: string;
  photo?: ImageMetadata;
  photoUrl?: string;
}

/**
 * Identity key for de-duplication. The submitter's email is the reliable key;
 * co-speakers (who have no email) fall back to a normalized name + profile link.
 * Name alone is unreliable — e.g. "Avinash" vs "Avinash Kundaliya" in the archives.
 */
function identityKey(email: string | undefined, name: string, link?: string): string {
  if (email && email.trim()) return `e:${email.trim().toLowerCase()}`;
  return `n:${name.trim().toLowerCase()}|${(link ?? '').trim().toLowerCase()}`;
}

/**
 * Accepted speakers for the site, from Turso, de-duplicated so one person
 * appears once even with several accepted talks. Manually-curated speakers in
 * announcement.ts come first. Fail-soft: returns the manual list if the DB is
 * unreachable or unconfigured, so a missing secret never breaks the build.
 */
export async function getAcceptedSpeakers(): Promise<DisplaySpeaker[]> {
  const manual: DisplaySpeaker[] = announcement.speakers.map((s) => ({
    name: s.name,
    title: s.title,
    tagline: s.tagline,
    link: s.link,
    photo: s.photo,
  }));

  const db = getTurso();
  if (!db) return manual;

  try {
    // `email` is read for de-duplication only — it is never rendered.
    const { rows } = await db.execute(
      "SELECT id, title, session_category, duration, speakers, email FROM proposals WHERE status = 'accepted' ORDER BY created_at"
    );

    const out = [...manual];
    const seen = new Set(manual.map((m) => identityKey(undefined, m.name, m.link)));

    for (const row of rows) {
      const talk = String(row.title ?? '').trim();
      const email = row.email ? String(row.email) : undefined;
      // per-proposal, so every speaker on it inherits both
      const category = String(row.session_category ?? '').trim() || undefined;
      const duration = String(row.duration ?? '').trim().toLowerCase() || undefined;

      let submitted: Array<Record<string, string>> = [];
      try {
        submitted = JSON.parse(String(row.speakers ?? '[]'));
      } catch {
        submitted = [];
      }
      if (!Array.isArray(submitted)) continue;

      submitted.forEach((sp, i) => {
        const name = String(sp?.name ?? '').trim();
        if (!name) return;
        // Only the first speaker is the submitter, so only they own the email.
        const key = identityKey(i === 0 ? email : undefined, name, sp?.profileLink);
        if (seen.has(key)) return;
        seen.add(key);

        out.push({
          name,
          title: talk,
          tagline: String(sp?.introduction ?? '').trim(),
          category,
          duration,
          link: String(sp?.profileLink ?? '').trim() || undefined,
          photo: uploadedPhoto(row.id, i),
          photoUrl: String(sp?.photoUrl ?? '').trim() || undefined,
        });
      });
    }

    return out;
  } catch (err: any) {
    console.error('getAcceptedSpeakers: falling back to manual list —', err?.message || err);
    return manual;
  }
}
