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
      headline: "BarCamp Kathmandu\nreturns again.",
      sub: 'BarCamp Kathmandu returns for 2026 a day built by whoever shows up. Details unfold here as we lock them in.',
    },
    date: {
      eyebrow: 'Save the date',
      headline: 'August 15,\n2026.',
      sub: 'Mark your calendar. Venue, sessions, and speakers land here next.',
    },
    venue: {
      eyebrow: 'We have a home',
      headline: "We've got\na venue.",
      sub: 'The where is settled. Next up: the call for speakers.',
    },
    'call-for-speakers': {
      eyebrow: 'Call for speakers',
      headline: 'Show up.\nSpeak up.',
      sub: "A day with no fixed agenda and no passive audience. You decide the talks — propose a session, upvote the ones you'd attend, and help build the day as it happens.",
    },
    speakers: {
      eyebrow: 'The lineup',
      headline: 'Meet the\nspeakers.',
      sub: "Here's who's taking the floor — more added as they're confirmed.",
    },
  },

  speakers: [],
};
