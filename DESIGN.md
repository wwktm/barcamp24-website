# Design System — BarCamp Kathmandu

Design tokens and UI patterns used across the site. Tokens live in two places:

- **`tailwind.config.ts`** — theme extensions (fonts alias, `marquee` animation).
- **`src/styles/style.css`** — font loading, base element styles, the custom `.container`, and reusable component classes (`.tag`, `.rounded-button`, `.highlighted`, etc.).

Most styling is done with Tailwind utility classes directly in the `.astro`/`.tsx` components.

> Note: past editions in `src/ktm-<year>/` are frozen snapshots and may use slightly older tokens. This document describes the **latest** edition (`src/components/`, `src/layouts/Layout.astro`).

---

## Colors

Brand primary is **`orange-500` (#f97316)** — links, highlights, primary CTAs, borders, active states.

| Role | Token(s) |
| --- | --- |
| Primary / brand | `orange-500` (links via `a { @apply text-orange-500 }`, `.highlighted`, CTAs, borders) |
| Orange scale | `orange-50` · `orange-100` (soft pills) · `orange-400` (schedule accent, form submit) · `orange-500` · `orange-700`/`800`/`900` (hover / darker CTAs) |
| Secondary accent | `sky-400` (sub-headings), `sky-100` (gradient head) |
| Body text | `stone-900` |
| Paragraph text | `#262a41` (`.text-paragraph`, applied to all `<p>`) |
| Muted / secondary text | `gray-500` · `gray-700` · `gray-900` · `black` |
| Surfaces | `white` (page), `gray-100` blocks |
| Signature gradient | `bg-gradient-to-l from-sky-100 to-orange-50` (hero, footer, supporters, proposal hero) |
| Feedback | `green-50` (success), `red-50` (error) |
| Illustration | `#8d82d4` (animated logo SVG) |

## Typography

- **Loaded fonts** (Google Fonts, via CSS `@import` with `&display=swap`): **Sora** + **Inter**.
- **UI / headings / body default:** `Sora` — `body { @apply font-sora }`, utility `.font-sora`.
- **Paragraphs:** `Inter` — `p { @apply font-inter text-paragraph }`, utility `.font-inter`.
- **Sizes (as used):** hero `sm:text-7xl text-4xl font-bold`; section titles `text-3xl font-bold`; sub-heads `text-lg`–`text-xl`; body `text-lg`.
- `.highlighted` = `text-orange-500` for emphasized heading words.

## Layout, Spacing & Radius

- **Container (custom):** `.container { @apply px-4 max-w-6xl mx-auto }` — overrides Tailwind's default container, pinning content to **`max-w-6xl` (1152px)** centered.
- **Section rhythm:** `container mx-auto px-4` with vertical padding `py-10` / `py-14` / `py-20`.
- **Radius:** `rounded-full` (buttons, pills, tags, avatars) · `rounded-md` (inputs, alerts) · `rounded-lg` (images) · `rounded-xl` (cards).
- **Shadow:** `shadow` (header) · `shadow-sm` (cards).

## Components & Patterns

- **Primary CTA:** `bg-orange-500 text-white rounded-full px-7 py-3 text-lg font-bold hover:bg-orange-700`
- **Secondary CTA:** same shape, `bg-orange-800 hover:bg-orange-900`
- **Outline button** (`.rounded-button`): `text-orange-500 border-2 border-orange-500 rounded-full p-3 hover:bg-orange-500 hover:text-white`
- **Year-switcher pill** (header): `rounded-full border border-black px-5 py-2 text-base font-medium hover:bg-orange-700 hover:text-white`
- **Form input:** `w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none`
- **Form submit:** `bg-orange-400 text-white rounded-md hover:bg-orange-500 disabled:bg-slate-100 disabled:text-slate-400`
- **Alert:** `rounded-md bg-green-50 p-4` (success) / `bg-red-50 p-4` (error) with a Heroicons `CheckCircleIcon`
- **Tag / chip:** `.tag { @apply bg-gray-100 text-black py-1 px-3 rounded-full text-xs font-normal }`; container `.tags { @apply flex flex-wrap gap-1.5 }`
- **Avatars:** `rounded-full border-4` — proposal `border-orange-500` @ `w-20`; stacked `border-gray-300` @ `w-16 h-16 object-cover`, overlapped `-ml-1.5`
- **Card:** `rounded-xl border-2 border-gray-300 bg-white shadow-sm`
- **FAQ accordion:** native `<details>`/`<summary>` with `group` + `group-open:` icon swap, `divide-y divide-gray-300`
- **Header:** `bg-white shadow`; inner `.container flex items-center justify-between`; logo box `flex w-48 h-16 sm:h-20`; hamburger `lg:hidden`, desktop menu `hidden lg:flex`

## Motion

- **Marquee** (`tailwind.config.ts`): `marquee 25s linear infinite`, `translateX(0% → -100%)`. Applied as `animate-marquee sm:animate-none` (scrolls on mobile, static `sm+`) — homepage image strip + slogan bar.
- **Animated logo SVG** (`style.css`): stroke-dash + mask + fade keyframes (`dashforward`/`dashbackward`, `side-masks`/`middle-mask`, `image`, `opacity-easeInOutBounce`) that draw/reveal the logo on load.

## Known Inconsistencies (cleanup candidates)

- `tailwind.config.ts` `fontFamily.montserrat` maps to **Lora**, which is **never loaded** (`@import` only pulls Sora + Inter) → `font-montserrat` silently falls back to `serif`. Rename/remove or actually load it.
- Fonts load via CSS `@import ...&display=swap` → late font swap (FOUT). Prefer `<link rel="preconnect">` + `<link rel="stylesheet">` in the layout `<head>`, or self-host.
- Accent drift: radio-checked uses `blue-400`, and the form submit uses `orange-400` instead of the primary `orange-500`.
- `.container` is a **custom override** of Tailwind's default — keep in mind before assuming responsive-container behavior.
