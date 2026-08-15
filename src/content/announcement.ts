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
  /** The day has been and gone. Says so in the hero and drops the countdown. */
  eventOver: boolean;
  /** What to point people at next. Shown in the hero once the event is over. */
  nextUp: { label: string; href: string; linkText: string };
  /** Where the hero's ticket button goes. Leave empty to hide the button. */
  ticketsUrl: string;
  /** Organisers' WhatsApp, country code first, digits only. Leave empty to hide the help button. */
  whatsappNumber: string;
  event: {
    date: string;
    /** Doors, as a fixed instant. The +05:45 offset is what keeps every visitor
     *  counting to the same moment rather than to 10am wherever they happen to be. */
    startsAt: string;
    /** When the countdown lets itself be seen. Checked in the browser on every
     *  load, so it appears on its own at this moment with nothing to deploy. */
    countdownFrom: string;
    /** Shown beside the date. Doors to close, as people should read it. */
    hours: string;
    venue: { name: string; note?: string };
    entry: string;
  };
  hero: HeroCopy;
  /** Hand-added speakers; accepted proposals from the DB are appended to these. */
  speakers: Speaker[];
}

export const announcement: Announcement = {
  callForSpeakersOpen: false,
  eventOver: true,

  nextUp: {
    label: 'AI Conf is coming back.',
    href: 'https://aiconf.asia',
    linkText: 'aiconf.asia',
  },

  ticketsUrl: '',

  whatsappNumber: '',

  event: {
    date: 'August 15, 2026',
    startsAt: '2026-08-15T10:00:00+05:45',
    countdownFrom: '2026-08-14T10:00:00+05:45',
    hours: '10 AM – 4 PM',
    venue: { name: 'IIMS College, Naxal', note: '' },
    entry: 'Free-ish, community-run',
  },

  hero: {
    headline: 'Show up.\nSpeak up.',
    sub: 'Talk, listen, argue, or just follow your curiosity. All you have to do is turn up and join the ride.',
  },

  speakers: [],
};
