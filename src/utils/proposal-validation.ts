/**
 * Single source of truth for proposal form validation.
 *
 * Both the browser form and the API route parse and validate through here, so
 * the two can never drift. Limits are deliberately generous — enough room to
 * describe a session properly, tight enough to keep the review queue readable.
 */

export const SESSION_CATEGORIES = [
  'Information Technology',
  'Music',
  'Design',
  'Arts',
  'Philosophy',
  'Life and Lifestyle',
  'AI',
  'Blockchain',
  'Futuristic',
  'Nostalgia',
  'Standup Comedy',
  'Deep Dive',
  'Education and Training',
  'Health and Fitness',
  'Other',
] as const;

export const DURATIONS = ['regular', 'lightning'] as const;

/** What the photo upload accepts. Anything else is rejected before it reaches the DB. */
export const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

export const LIMITS = {
  /** 2 MB: a Turso BLOB write of that size lands in well under a second. */
  photoBytes: { max: 2 * 1024 * 1024 },
  title: { min: 5, max: 120 },
  description: { min: 30, max: 1200 },
  categoryOther: { min: 2, max: 40 },
  tag: { min: 2, max: 25 },
  tagCount: { min: 1, max: 5 },
  speakerName: { min: 2, max: 60 },
  speakerIntro: { max: 400 },
  url: { max: 300 },
  email: { max: 254 },
  phone: { min: 7, max: 20 },
} as const;

/**
 * The metadata of an uploaded photo, without its bytes. Validation only needs
 * the size and type; the API reads the bytes straight off the FormData.
 */
export interface UploadedPhoto {
  size: number;
  type: string;
}

export interface ProposalSpeaker {
  name: string;
  photoUrl: string;
  profileLink: string;
  introduction: string;
  /** Set only when a file was actually chosen. */
  photo?: UploadedPhoto;
}

export interface ProposalInput {
  email: string;
  phone: string;
  duration: string;
  sessionCategory: string;
  categoryOther: string;
  title: string;
  tags: string[];
  description: string;
  speakers: ProposalSpeaker[];
}

/** Field-keyed messages. Speaker fields use `speakers.<index>.<field>`. */
export type ProposalErrors = Record<string, string>;

const str = (v: FormDataEntryValue | null) => (typeof v === 'string' ? v.trim() : '');

/**
 * Reads a proposal out of FormData. Shared so the client validates exactly the
 * payload the server will see, including the speakers[<i>][<field>] encoding.
 */
export function parseProposalForm(formData: FormData): ProposalInput {
  const speakers: ProposalSpeaker[] = [];
  const blank = (): ProposalSpeaker => ({
    name: '',
    photoUrl: '',
    profileLink: '',
    introduction: '',
  });

  formData.forEach((value, key) => {
    const text = key.match(/^speakers\[(\d+)\]\[(name|photoUrl|profileLink|introduction)\]$/);
    if (text) {
      const idx = Number(text[1]);
      speakers[idx] ??= blank();
      speakers[idx][text[2] as 'name' | 'photoUrl' | 'profileLink' | 'introduction'] =
        String(value).trim();
      return;
    }

    const file = key.match(/^speakers\[(\d+)\]\[photo\]$/);
    if (!file) return;
    // An untouched file input still submits an empty File, so size 0 means
    // "nothing chosen" rather than "a chosen file that happens to be empty".
    if (!isFileLike(value) || value.size === 0) return;
    const idx = Number(file[1]);
    speakers[idx] ??= blank();
    speakers[idx].photo = { size: value.size, type: value.type };
  });

  return {
    email: str(formData.get('email')),
    phone: str(formData.get('phone')),
    duration: str(formData.get('duration')),
    sessionCategory: str(formData.get('session_category')),
    categoryOther: str(formData.get('category_other')),
    title: str(formData.get('title')),
    tags: parseTags(str(formData.get('tags'))),
    description: str(formData.get('description')),
    // drop holes left by a sparse speakers[] index
    speakers: Array.from(speakers, (s) => s ?? blank()),
  };
}

/**
 * True for a File without relying on the `File` global, which is not present on
 * every runtime this validation runs in.
 */
function isFileLike(v: unknown): v is { size: number; type: string } {
  return typeof v === 'object' && v !== null && 'size' in v && 'arrayBuffer' in v;
}

/** Splits the comma-separated tag input, trimming blanks and de-duping case-insensitively. */
export function parseTags(raw: string): string[] {
  const seen = new Set<string>();
  return raw
    .split(',')
    .map((t) => t.trim())
    .filter((t) => {
      if (!t) return false;
      const k = t.toLowerCase();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
}

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

/**
 * Deliberately permissive: a Nepali mobile, a landline with an area code, and a
 * number from abroad all have to get through. It only rules out things that
 * cannot be dialled — stray characters, or too few or too many digits.
 */
const isPhone = (s: string) => {
  if (!/^\+?[\d\s\-()]+$/.test(s)) return false;
  const digits = s.replace(/\D/g, '').length;
  return digits >= 7 && digits <= 15;
};

/** Accepts only http(s) — rules out `javascript:` and other schemes an <input type="url"> allows. */
const isHttpUrl = (s: string) => {
  try {
    const u = new URL(s);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
};

const range = (label: string, value: string, min: number, max: number) => {
  if (!value) return `${label} is required.`;
  if (value.length < min) return `${label} must be at least ${min} characters.`;
  if (value.length > max) return `${label} must be under ${max} characters.`;
  return null;
};

/**
 * Validates a parsed proposal. Returns a field-keyed map of messages; an empty
 * map means the submission is good.
 */
export function validateProposal(input: ProposalInput): ProposalErrors {
  const errors: ProposalErrors = {};
  const set = (key: string, msg: string | null) => {
    if (msg && !errors[key]) errors[key] = msg;
  };

  if (!input.email) set('email', 'Contact email is required.');
  else if (!isEmail(input.email) || input.email.length > LIMITS.email.max) {
    set('email', 'Enter a valid email address.');
  }

  if (!input.phone) set('phone', 'Contact phone number is required.');
  else if (input.phone.length > LIMITS.phone.max || !isPhone(input.phone)) {
    set('phone', 'Enter a phone number we can reach you on.');
  }

  if (!(DURATIONS as readonly string[]).includes(input.duration)) {
    set('duration', 'Choose a session length.');
  }

  if (!input.sessionCategory) {
    set('session_category', 'Pick a session category.');
  } else if (!(SESSION_CATEGORIES as readonly string[]).includes(input.sessionCategory)) {
    set('session_category', 'Pick a session category from the list.');
  } else if (input.sessionCategory === 'Other') {
    set(
      'category_other',
      range('Your category', input.categoryOther, LIMITS.categoryOther.min, LIMITS.categoryOther.max)
    );
  }

  set('title', range('Topic title', input.title, LIMITS.title.min, LIMITS.title.max));
  set(
    'description',
    range('Short description', input.description, LIMITS.description.min, LIMITS.description.max)
  );

  if (input.tags.length < LIMITS.tagCount.min) {
    set('tags', 'Add at least one tag.');
  } else if (input.tags.length > LIMITS.tagCount.max) {
    set('tags', `Use at most ${LIMITS.tagCount.max} tags.`);
  } else if (input.tags.some((t) => t.length < LIMITS.tag.min || t.length > LIMITS.tag.max)) {
    set('tags', `Each tag must be ${LIMITS.tag.min}-${LIMITS.tag.max} characters.`);
  }

  if (input.speakers.length === 0) {
    set('speakers.0.name', 'Speaker name is required.');
  }
  input.speakers.forEach((s, i) => {
    set(
      `speakers.${i}.name`,
      range('Speaker name', s.name, LIMITS.speakerName.min, LIMITS.speakerName.max)
    );
    for (const field of ['photoUrl', 'profileLink'] as const) {
      const url = s[field];
      if (!url) continue; // a blank link is caught by the photo rule below, if at all
      if (url.length > LIMITS.url.max) set(`speakers.${i}.${field}`, 'This link is too long.');
      else if (!isHttpUrl(url)) set(`speakers.${i}.${field}`, 'Enter a full http(s) link.');
    }

    // A photo is required, but either way of giving one will do.
    if (s.photo) {
      if (!(PHOTO_TYPES as readonly string[]).includes(s.photo.type)) {
        set(`speakers.${i}.photo`, 'Use a JPEG, PNG or WebP image.');
      } else if (s.photo.size > LIMITS.photoBytes.max) {
        set(`speakers.${i}.photo`, 'That photo is over 2 MB. Pick a smaller one.');
      }
    } else if (!s.photoUrl) {
      set(`speakers.${i}.photo`, 'Add a photo, either a file or a link.');
    }
    if (s.introduction.length > LIMITS.speakerIntro.max) {
      set(`speakers.${i}.introduction`, `Keep this under ${LIMITS.speakerIntro.max} characters.`);
    }
  });

  return errors;
}

/** The category actually stored: the free-text value when "Other" was chosen. */
export function resolveCategory(input: ProposalInput): string {
  return input.sessionCategory === 'Other' ? input.categoryOther : input.sessionCategory;
}
