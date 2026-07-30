import type { APIRoute } from 'astro';
import { getTurso } from '../../utils/turso';

export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();

    // Honeypot: a hidden field humans never fill. If a bot filled it, pretend
    // success and silently drop the submission.
    if (((formData.get('company') as string) || '').trim() !== '') {
      return json({ success: true });
    }

    const title = ((formData.get('title') as string) || '').trim();
    const description = ((formData.get('description') as string) || '').trim();
    const email = ((formData.get('email') as string) || '').trim();
    const duration = ((formData.get('duration') as string) || '').trim();
    const tagsRaw = (formData.get('tags') as string) || '';
    let session_category = ((formData.get('session_category') as string) || '').trim();
    const category_other = (formData.get('category_other') as string) || '';
    if (session_category === 'Other') {
      session_category = category_other.trim() || session_category;
    }

    // Basic validation / spam guard.
    if (title.length < 3 || title.length > 200) {
      return json({ success: false, error: 'A valid title is required.' }, 400);
    }
    if (description.length < 10 || description.length > 5000) {
      return json({ success: false, error: 'A valid description is required.' }, 400);
    }
    if (!isEmail(email) || email.length > 254) {
      return json({ success: false, error: 'A valid email is required.' }, 400);
    }

    // Reassemble speakers[<i>][<field>] into objects.
    const speakers: Array<Record<string, string>> = [];
    formData.forEach((value, key) => {
      const m = key.match(/^speakers\[(\d+)\]\[(\w+)\]$/);
      if (m) {
        const idx = parseInt(m[1], 10);
        if (!speakers[idx]) {
          speakers[idx] = { name: '', photoUrl: '', profileLink: '', introduction: '' };
        }
        speakers[idx][m[2]] = String(value);
      }
    });
    const filteredSpeakers = speakers.filter(Boolean);
    const tags = tagsRaw
      ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

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
        title,
        description,
        session_category || null,
        duration || null,
        JSON.stringify(tags),
        JSON.stringify(filteredSpeakers),
        email,
      ],
    });

    return json({ success: true });
  } catch (err: any) {
    console.error('submit-proposal error:', err?.message || err);
    return json({ success: false, error: 'Something went wrong. Please try again.' }, 500);
  }
};
