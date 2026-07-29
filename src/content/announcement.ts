import type { ImageMetadata } from 'astro';

export const PHASES = ['teaser', 'date', 'venue', 'call-for-speakers', 'speakers'] as const;
export type Phase = (typeof PHASES)[number];

export interface Speaker {
  name: string;
  title: string;      // talk / session title
  tagline: string;    // one line
  link?: string;      // profile URL
  photo: ImageMetadata;
}

export interface HeroCopy {
  eyebrow: string;
  headline: string;   // may contain \n for a two-line hero
  sub?: string;
}

export interface Announcement {
  currentPhase: Phase;
  event: { date: string; venue: { name: string; note?: string }; entry: string };
  hero: Record<Phase, HeroCopy>;
  speakers: Speaker[];
}

export const announcement: Announcement = {
  currentPhase: 'teaser',

  event: {
    date: 'August 15, 2026',
    venue: { name: 'Venue TBA', note: '' },
    entry: 'Free-ish, community-run',
  },

  hero: {
    teaser: {
      eyebrow: 'The unconference · Kathmandu',
      headline: 'Show up.\nSpeak up.',
      sub: 'Talk, listen, argue, or just follow your curiosity. All you have to do is turn up and join the ride.',
    },
    date: {
      eyebrow: 'Save the date',
      headline: 'August 15,\n2026.',
      sub: "Put it in your calendar. We're still hunting for a venue.",
    },
    venue: {
      eyebrow: 'We have a home',
      headline: "We've got\na venue.",
      sub: 'Now we need talks.',
    },
    'call-for-speakers': {
      eyebrow: 'Call for speakers',
      headline: 'Show up.\nSpeak up.',
      sub: "No fixed agenda, no passive audience. Propose a session, upvote the ones you'd actually sit through, and we pin the schedule up on the morning.",
    },
    speakers: {
      eyebrow: 'The lineup',
      headline: 'Meet the\nspeakers.',
      sub: "Who's speaking so far. More get added right up to the morning of.",
    },
  },

  speakers: [],
};
