// Checks the built site in dist/ against the MOTULEN spec. Exit 1 with a list of problems.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';

const DIST = 'dist';
const LANGS = ['zh', 'pl'];
const SERVICES = ['operations-outsourcing', 'warehouse-engineering', 'commercial-spaces', 'recruitment', 'equipment-service'];
const PAGES = ['', 'about/', 'value/', 'projects/', 'platform/', 'contact/', ...SERVICES.map((s) => `services/${s}/`)];
const BANNED = /RECON|recon\.org|AIoT|BHP|Safety culture|href="[^"]*\/en\//;
// client company names must never appear on the site (compliance)
const CLIENTS = /HUIMING|OSMOFROST|JANPOL|dabar|amazon|NONKO/i;
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
  const c = readFileSync(f, 'utf8').match(CLIENTS);
  if (c) problems.push(`${f}: client name "${c[0]}"`);
}

const tl = execSync('grep -rlE "(^|[^A-Za-z_])t\\(lang," src || true').toString().trim();
if (tl) problems.push(`hardcoded copy via t(lang…) in: ${tl.replace(/\n/g, ', ')}`);

const must = [
  ['zh/services/equipment-service/', '本页为发展规划'],
  ['zh/platform/', '不代表'],
  ['zh/projects/', '具体合作主体和范围'],
  ['pl/services/equipment-service/', 'Plan rozwoju usług'],
  ['pl/platform/', 'spółki matki'],
  ['pl/platform/', 'posiadania biur'],
  ['pl/projects/', 'Strony i zakres współpracy'],
];
const mustNot = [
  ...PAGES.map((p) => [`pl/${p}`, 'iedzib']),
];
for (const [p, s] of mustNot) {
  const f = join(DIST, p, 'index.html');
  if (existsSync(f) && readFileSync(f, 'utf8').includes(s)) problems.push(`/${p}: must not contain "${s}"`);
}
// the nav marks the current section (needs to survive the GitHub Pages base path)
for (const lang of LANGS) for (const p of ['about/', 'value/', 'projects/', 'platform/', 'services/recruitment/']) {
  const f = join(DIST, lang, p, 'index.html');
  if (existsSync(f) && !/class="navlink current"[^>]*aria-current="page"|aria-current="page"[^>]*class="navlink current"/.test(readFileSync(f, 'utf8')))
    problems.push(`/${lang}/${p}: nav has no current item`);
}
for (const [p, s] of must) {
  const f = join(DIST, p, 'index.html');
  if (existsSync(f) && !readFileSync(f, 'utf8').includes(s)) problems.push(`/${p}: missing required text "${s}"`);
}

// every internal link in the built site must point to an existing page (and anchor)
const anchors = new Map();
const idsOf = (f) => anchors.get(f) ?? anchors.set(f, new Set([...readFileSync(f, 'utf8').matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]))).get(f);
for (const f of walk(DIST).filter((f) => f.endsWith('.html'))) {
  for (const [, href] of readFileSync(f, 'utf8').matchAll(/<a [^>]*href="(\/[^"]*)"/g)) {
    if (href.startsWith('//')) continue;
    const [pathAndQuery, hash] = href.split('#');
    const path = pathAndQuery.split('?')[0].replace(base, '');
    const target = path.endsWith('/') ? join(DIST, path, 'index.html') : join(DIST, path);
    if (!existsSync(target)) { problems.push(`${f}: broken link ${href}`); continue; }
    if (hash && target.endsWith('.html') && !idsOf(target).has(hash)) problems.push(`${f}: missing anchor ${href}`);
  }
}

if (problems.length) { console.error(`FAIL — ${problems.length} problem(s)\n- ` + problems.slice(0, 60).join('\n- ')); process.exit(1); }
console.log(`PASS — ${LANGS.length * PAGES.length} pages checked`);
