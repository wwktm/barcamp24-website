/**
 * Shared FAQ content, used by every year's site.
 *
 * Answers are HTML strings, but deliberately carry NO CSS classes — each year's
 * FAQ component styles `a` / `strong` / `em` inside its own answer container, so
 * the same copy renders in the 2024, 2025 and 2026 designs without change.
 *
 * Rendered by:
 *   - src/components/landing/Faq.astro            (2026)
 *   - src/ktm-2025/components/homepage/Faq.astro  (2025)
 *   - src/ktm-2024/components/homepage/Faq.astro  (2024)
 */

export interface FaqItem {
  q: string;
  /** Each string is one paragraph. May contain inline HTML (a / strong / em). */
  a: string[];
}

/** Canonical social profiles. Mirrors the links in the year Footer components. */
export const socials = [
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/wwktm' },
  { name: 'Instagram', href: 'https://www.instagram.com/wwktm_com' },
  { name: 'Facebook', href: 'https://www.facebook.com/wwktm/' },
  { name: 'X', href: 'https://x.com/wwktm_com' },
  { name: 'YouTube', href: 'https://www.youtube.com/@wwktm_' },
] as const;

/**
 * Web Weekend Kathmandu is the group behind the event — always render the name
 * bold so it reads as an organisation rather than prose. Use this in any answer
 * that mentions them.
 */
export const WWKTM = '<strong>Web Weekend Kathmandu</strong>';

const socialLinks = socials
  .map((s) => `<a href="${s.href}" target="_blank" rel="noopener noreferrer">${s.name}</a>`)
  .join(', ')
  .replace(/, ([^,]*)$/, ' and $1');

export const faqs: FaqItem[] = [
  {
    q: 'What is BarCamp Kathmandu?',
    a: [
      'BarCamp Kathmandu is an unconference: a participant-driven event where anyone can share, learn, and connect in an open and informal setting. Unlike traditional conferences with a fixed programme, BarCamp is built around sessions proposed by attendees themselves.',
      'Whether you’re a developer, designer, entrepreneur, student, or simply curious, BarCamp is a space where ideas flow freely, and everyone is encouraged to contribute.',
      'The only rule? If you attend, try to present something. Even a question or a story can spark a great discussion.',
    ],
  },
  {
    q: 'Wait, what is an unconference?',
    a: [
      'An unconference is a gathering for attendees <em>by the attendees</em>. This means you decide what to talk about and what talks to listen to. You are the attendee, you are the speaker.',
      'Beyond the few talks that open the day, there is no fixed schedule until the event itself. The sessions cover a variety of topics, and the day is created collaboratively, built by you and the other attendees who have a topic, story, knowledge, or experience to share with the rest of the community.',
    ],
  },
  {
    q: 'Who should attend BarCamp Kathmandu?',
    a: [
      'Everyone. Session categories range from technology, music, arts, lifestyle, fitness, to design, arts, philosophy. So, yeah, we do really mean <strong>everyone</strong> can attend.',
    ],
  },
  {
    q: 'How can I stay updated on the event details?',
    a: [
      `Follow us on ${socialLinks} to keep up with our announcements.`,
    ],
  },
  {
    q: 'Can I present at the BarCamp? What topics can I cover?',
    a: [
      'Yes you can!',
      'Giving a session is a <strong>perfect opportunity to speak about that cool topic you are interested in</strong>: whether it be about your unique take on Fitness and Art, about that cool use case for AI you discovered, or about the rabbit hole you went down last year about Nepali traditional <em>Dhunge dharas</em>.',
    ],
  },
  {
    q: 'How are topics chosen?',
    a: [
      'Most session topics are scheduled the morning of the event and are provided by the attendees.',
      'Speakers can also submit proposals before the day of the event, and attendees can upvote to indicate their interest in the talk.',
      'The idea, however, is that there will be large amounts of open space in the calendar on the morning of the event, and if someone wants to give a talk on the day, they will have space and time to do so.',
      'If you’re at the conference and there is no session that interests you, recognise that this is <em>your conference</em>! So please go ahead and hold an impromptu session in the open spaces at the venue.',
    ],
  },
  {
    q: 'Does BarCamp have something to do with bars and alcohol?',
    a: [
      '<strong>No, it doesn’t.</strong> It’s actually a hacker reference to FooBar, which is typically used as a placeholder name when describing something in software code. BarCamp arose as an open-to-the-public alternative to Foo Camp, which is an invitation-only conference.',
    ],
  },
  {
    q: 'Who is organizing this?',
    a: [
      `Well, this is an unconference, so all attendees (yes, YOU!) will play an important role in organizing it, selecting talks, etc. But the logistics will be managed by the team behind ${WWKTM}.`,
    ],
  },
];
