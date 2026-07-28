import { readFileSync, writeFileSync, existsSync, cpSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT: string = process.cwd();
const SRC: string = join(ROOT, 'src');
const CONFIG: string = join(SRC, 'config.ts');

const newYear: number = Number(process.argv[2]);
if (!Number.isInteger(newYear) || newYear < 2024 || newYear > 3000) {
  console.error('Usage: npm run new-year <newYear>   e.g. npm run new-year 2027');
  process.exit(1);
}

const configText: string = readFileSync(CONFIG, 'utf8');
const match: RegExpMatchArray | null = configText.match(/LATEST_YEAR\s*=\s*(\d{4})/);
if (!match) {
  console.error('Could not find LATEST_YEAR in src/config.ts');
  process.exit(1);
}
const prevYear: number = Number(match[1]);
if (newYear <= prevYear) {
  console.error(`newYear (${newYear}) must be greater than current LATEST_YEAR (${prevYear}).`);
  process.exit(1);
}

const frozenDir: string = join(SRC, `ktm-${prevYear}`);
if (existsSync(frozenDir)) {
  console.error(`${frozenDir} already exists — refusing to overwrite.`);
  process.exit(1);
}

// 1. Freeze the live edition into src/ktm-<prevYear>/
mkdirSync(frozenDir, { recursive: true });
cpSync(join(SRC, 'components'), join(frozenDir, 'components'), { recursive: true });
cpSync(join(SRC, 'images'), join(frozenDir, 'images'), { recursive: true });
cpSync(join(SRC, 'styles', 'style.css'), join(frozenDir, 'style.css'));

// 2. Freeze the layout: self-contained imports + bake the year in as a literal
//    (must NOT keep importing LATEST_YEAR — that would make the archive show the new year).
const layout: string = readFileSync(join(SRC, 'layouts', 'Layout.astro'), 'utf8')
  .replaceAll("'../components/", "'./components/")
  .replaceAll("'../styles/style.css'", "'./style.css'")
  .replace(/import\s*\{\s*LATEST_YEAR\s*\}\s*from\s*'\.\.\/config';?/, `const LATEST_YEAR = ${prevYear};`);
// Guard: the frozen layout must bake in its own year. If Layout.astro's import
// shape ever drifts and the replace above no-ops, the archive would silently show
// the newly-bumped year. Fail loudly instead of shipping that bug.
if (layout.includes("from '../config'")) {
  console.error(
    "Layout.astro's `import { LATEST_YEAR } from '../config'` did not match the expected shape, " +
    "so the frozen layout would still read the live (bumped) year. " +
    'Update the replace() in scripts/new-year.ts to match the current import.'
  );
  process.exit(1);
}
writeFileSync(join(frozenDir, `Layout${prevYear}.astro`), layout);

// 3. Generate the archive page by freezing the current index.astro
const page: string = readFileSync(join(SRC, 'pages', 'index.astro'), 'utf8')
  .replaceAll('../layouts/Layout.astro', `../../ktm-${prevYear}/Layout${prevYear}.astro`)
  .replaceAll('../components/', `../../ktm-${prevYear}/components/`)
  .replaceAll('../images/', `../../ktm-${prevYear}/images/`)
  .replaceAll('../styles/style.css', `../../ktm-${prevYear}/style.css`)
  .replaceAll('../config', '../../config');
mkdirSync(join(SRC, 'pages', 'ktm'), { recursive: true });
writeFileSync(join(SRC, 'pages', 'ktm', `${prevYear}.astro`), page);

// 4. Bump LATEST_YEAR
writeFileSync(CONFIG, configText.replace(/LATEST_YEAR\s*=\s*\d{4}/, `LATEST_YEAR = ${newYear}`));

console.log(`\nFroze ${prevYear} into src/ktm-${prevYear}/ and set LATEST_YEAR=${newYear}.`);
console.log(`NEXT STEPS (manual):`);
console.log(`  1. Add a "${prevYear}" link to src/components/common/HeaderMenu.astro`);
console.log(`  2. Review src/pages/ktm/${prevYear}.astro (generated from index.astro) and adjust if needed.`);
console.log(`  3. Rebuild src/components/ for ${newYear}.`);
console.log(`  4. Run: npm run build`);
