# BarCamp Kathmandu Website

Astro 4 site for BarCamp Kathmandu, deployed on Netlify. The latest edition is served at
`/`; past editions are frozen at `/ktm/<year>`. Proposal submissions are stored in Supabase.

## Develop

```sh
npm install
npm run dev        # local dev server
npm run build      # production build to dist/
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
```

## Environment

Copy `.env.example` to `.env` and fill in:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

## Editions & starting a new year

The edition at `/` lives in `src/components/` + `src/layouts/Layout.astro`. `src/config.ts`
`LATEST_YEAR` marks which year is live. Past editions are self-contained snapshots in
`src/ktm-<year>/`, served at `/ktm/<year>`. To roll over to a new year, see
[CONTRIBUTING.md](./CONTRIBUTING.md).
