import type { APIRoute } from 'astro';
import type { Client } from '@libsql/client';
import { getTurso } from '../../utils/turso';
import {
  parseProposalForm,
  validateProposal,
  resolveCategory,
} from '../../utils/proposal-validation';

export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

/**
 * Writes the uploaded photos into speaker_photos. A failure here is logged but
 * not surfaced: the proposal itself is already saved, and losing a photo is not
 * worth telling the submitter their session did not go through.
 */
async function storePhotos(
  db: Client,
  formData: FormData,
  speakerCount: number,
  proposalId: number
): Promise<void> {
  for (let i = 0; i < speakerCount; i++) {
    const file = formData.get(`speakers[${i}][photo]`);
    if (!file || typeof file === 'string' || file.size === 0) continue;
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      await db.execute({
        sql: `INSERT INTO speaker_photos (proposal_id, speaker_index, mime, bytes)
              VALUES (?, ?, ?, ?)
              ON CONFLICT (proposal_id, speaker_index)
              DO UPDATE SET mime = excluded.mime, bytes = excluded.bytes`,
        args: [proposalId, i, file.type, bytes],
      });
    } catch (err) {
      console.error(
        `submit-proposal: photo ${proposalId}/${i} not stored —`,
        err instanceof Error ? err.message : err
      );
    }
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();

    // Honeypot: a hidden field humans never fill. If a bot filled it, pretend
    // success and silently drop the submission.
    if (((formData.get('company') as string) || '').trim() !== '') {
      return json({ success: true });
    }

    const input = parseProposalForm(formData);
    const errors = validateProposal(input);
    if (Object.keys(errors).length > 0) {
      return json({ success: false, error: 'Please fix the highlighted fields.', errors }, 400);
    }

    const db = getTurso();
    if (!db) {
      // Fail-soft: env not configured (e.g. before Netlify vars are set).
      console.error('submit-proposal: Turso env not configured');
      return json({ success: false, error: 'Submissions are temporarily unavailable.' }, 503);
    }

    // The upload metadata is a validation concern only — the stored shape stays
    // {name, photoUrl, profileLink, introduction}, with the bytes in speaker_photos.
    // A blank photoUrl is stored as null, matching what normalize-photo-urls.ts
    // did to the older rows, so "no photo" is one value across the table.
    const stored = input.speakers.map((s) => ({
      name: s.name,
      photoUrl: s.photoUrl || null,
      profileLink: s.profileLink,
      introduction: s.introduction,
    }));

    const inserted = await db.execute({
      sql: `INSERT INTO proposals
              (title, description, session_category, duration, tags, speakers, email)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [
        input.title,
        input.description,
        resolveCategory(input),
        input.duration,
        JSON.stringify(input.tags),
        JSON.stringify(stored),
        input.email,
      ],
    });

    const proposalId = Number(inserted.lastInsertRowid);
    if (Number.isFinite(proposalId)) {
      await storePhotos(db, formData, input.speakers.length, proposalId);
    }

    return json({ success: true });
  } catch (err) {
    console.error('submit-proposal error:', err instanceof Error ? err.message : err);
    return json({ success: false, error: 'Something went wrong. Please try again.' }, 500);
  }
};
