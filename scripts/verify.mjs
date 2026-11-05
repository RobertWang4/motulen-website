// Checks the built site in dist/ against the MOTULEN spec. Exit 1 with a list of problems.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';

const DIST = 'dist';
const LANGS = ['zh', 'pl'];
const SERVICES = ['operations-outsourcing', 'warehouse-engineering', 'commercial-spaces', 'recruitment', 'robotics-service', 'cross-border-teams'];
const PAGES = ['', 'about/', 'services/', 'approach/', 'projects/', 'contact/', ...SERVICES.map((s) => `services/${s}/`)];
const BANNED = /RECON|recon\.org|AIoT|BHP|Safety culture|href="[^"]*\/en\//;
const problems = [];
const base = (process.env.BASE_PATH || '').replace(/\/$/, '');

const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
if (!existsSync(DIST)) { console.error('dist/ missing — run npm run build'); process.exit(1); }

for (const lang of LANGS) for (const p of PAGES) {
  const f = join(DIST, lang, p, 'index.html');
  if (!existsSync(f)) { problems.push(`missing page /${lang}/${p}`); continue; }
  const html = readFileSync(f, 'utf8');
  for (const [, href] of html.matchAll(/<link rel="alternate" hreflang="[^"]+" href="([^"]+)"/g)) {
    const path = new URL(href).pathname.replace(base, '');
    if (!existsSync(join(DIST, path, 'index.html'))) problems.push(`/${lang}/${p}: alternate ${path} does not exist`);
  }
  if (!/hreflang/.test(html)) problems.push(`/${lang}/${p}: no hreflang alternates`);
}

for (const f of walk(DIST).filter((f) => /\.(html|js|css|xml)$/.test(f))) {
  const m = readFileSync(f, 'utf8').match(BANNED);
  if (m) problems.push(`${f}: old-site text "${m[0]}"`);
}

const tl = execSync('grep -rlE "(^|[^A-Za-z_])t\\(lang," src || true').toString().trim();
if (tl) problems.push(`hardcoded copy via t(lang…) in: ${tl.replace(/\n/g, ', ')}`);

const must = [
  ['zh/services/robotics-service/', '本页为发展规划'],
  ['zh/about/', '不代表'],
  ['zh/projects/', 'dabar'],
  ['zh/projects/', '不代表与 Amazon 直接签约'],
  ['zh/about/', '也不代表 MOTULEN 在相关国家设有办公室'],
  ['zh/services/recruitment/', '全球招聘能力为发展方向'],
  ['pl/services/robotics-service/', 'plan rozwoju'],
  ['pl/about/', 'spółki matki'],
  ['pl/about/', 'MOTULEN posiada biura'],
  ['pl/projects/', 'nie oznacza bezpośredniej umowy z Amazon'],
  ['pl/services/recruitment/', 'Rekrutacja globalna jest kierunkiem rozwoju'],
];
const mustNot = [
  ['zh/about/', '业务流程外包'],
  ['pl/about/', 'outsourcingu procesów biznesowych'],
  ...PAGES.map((p) => [`pl/${p}`, 'iedzib']),
];
for (const [p, s] of mustNot) {
  const f = join(DIST, p, 'index.html');
  if (existsSync(f) && readFileSync(f, 'utf8').includes(s)) problems.push(`/${p}: must not contain "${s}"`);
}
// the nav marks the current section (needs to survive the GitHub Pages base path)
for (const lang of LANGS) for (const p of ['about/', 'services/', 'approach/', 'projects/', 'services/recruitment/']) {
  const f = join(DIST, lang, p, 'index.html');
  if (existsSync(f) && !/class="navlink current"[^>]*aria-current="page"|aria-current="page"[^>]*class="navlink current"/.test(readFileSync(f, 'utf8')))
    problems.push(`/${lang}/${p}: nav has no current item`);
}
for (const [p, s] of must) {
  const f = join(DIST, p, 'index.html');
  if (existsSync(f) && !readFileSync(f, 'utf8').includes(s)) problems.push(`/${p}: missing required text "${s}"`);
}

if (problems.length) { console.error(`FAIL — ${problems.length} problem(s)\n- ` + problems.slice(0, 60).join('\n- ')); process.exit(1); }
console.log(`PASS — ${LANGS.length * PAGES.length} pages checked`);
