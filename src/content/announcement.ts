import type { ImageMetadata } from 'astro';

export interface Speaker {
  name: string;
  title: string;      // talk / session title
  tagline: string;    // one line
  link?: string;      // profile URL
  photo: ImageMetadata;
}

export interface HeroCopy {
  eyebrow?: string;   // omit to render no eyebrow at all
  headline: string;   // may contain \n for a two-line hero
  sub?: string;
}

export interface Announcement {
  /** Flip to false to close submissions and hide the proposal CTAs. */
  callForSpeakersOpen: boolean;
  /** Where the hero's ticket button goes. Leave empty to hide the button. */
  ticketsUrl: string;
  event: { date: string; venue: { name: string; note?: string }; entry: string };
  hero: HeroCopy;
  /** Hand-added speakers; accepted proposals from the DB are appended to these. */
  speakers: Speaker[];
}

export const announcement: Announcement = {
  callForSpeakersOpen: true,

  ticketsUrl: 'https://eventsmo.com/en/event/barcamp-ktm-2026',

  event: {
    date: 'August 15, 2026',
    venue: { name: 'IIMS College, Naxal', note: '' },
    entry: 'Free-ish, community-run',
  },

  hero: {
    headline: 'Show up.\nSpeak up.',
    sub: 'Talk, listen, argue, or just follow your curiosity. All you have to do is turn up and join the ride.',
  },

  speakers: [],
};
