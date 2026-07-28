# Contributing

## Starting a new year (rollover)

The edition at the site root (`/`) lives in `src/components/` + `src/layouts/Layout.astro`,
and `src/config.ts` `LATEST_YEAR` records which year that is. Past editions are frozen,
self-contained snapshots in `src/ktm-<year>/`, served at `/ktm/<year>`.

To start, e.g., 2027:

1. Run `npm run new-year 2027`. This freezes the current edition into `src/ktm-<currentYear>/`,
   generates `src/pages/ktm/<currentYear>.astro`, and bumps `LATEST_YEAR` to 2027.
2. Add a link to the just-frozen year in `src/components/common/HeaderMenu.astro`.
3. Review the generated `src/pages/ktm/<currentYear>.astro` and adjust if the layout differs.
4. Rebuild `src/components/` for 2027 and run `npm run build`.

Never edit a `src/ktm-<year>/` folder after it's frozen — those are historical archives.
