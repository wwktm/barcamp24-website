import type { APIRoute } from 'astro';
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

    await db.execute({
      sql: `INSERT INTO proposals
              (title, description, session_category, duration, tags, speakers, email)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [
        input.title,
        input.description,
        resolveCategory(input),
        input.duration,
        JSON.stringify(input.tags),
        JSON.stringify(input.speakers),
        input.email,
      ],
    });

    return json({ success: true });
  } catch (err) {
    console.error('submit-proposal error:', err instanceof Error ? err.message : err);
    return json({ success: false, error: 'Something went wrong. Please try again.' }, 500);
  }
};
