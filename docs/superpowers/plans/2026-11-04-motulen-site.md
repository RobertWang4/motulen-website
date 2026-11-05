# MOTULEN GROUP Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the AIoT/RECON site with a complete, showable MOTULEN GROUP site in Chinese and Polish, built only from the PPT content.

**Architecture:** Keep Astro 7 + Tailwind v4 + zod static build. Every page reads structured per-page JSON through `src/lib/content.ts`; all UI strings move to `{lang}/ui.json`, so templates contain no copy. Layout follows DESIGN.md plus spec §5.1 upgrades.

**Tech Stack:** Astro 7, Tailwind v4, zod 4, plain CSS in `<style>` blocks, Node script for verification.

**Spec:** `docs/superpowers/specs/2026-11-04-motulen-site-design.md`

## Global Constraints

- Languages: `LANGS = ['zh', 'pl']`, default `zh`. URL shape `/{lang}/...`, `trailingSlash: 'always'`.
- No copy in templates: no `t(lang, …)` calls anywhere in `src/`. Copy only in `src/content/**`.
- Copy source: PPT only (spec Appendix A). Chinese = PPT wording with the two typo fixes in spec §8. No invented claims, years, numbers.
- Compliance (spec §7): no parent/subsidiary wording for MARASSI etc.; markets ≠ offices; 05/06 marked 发展中 / W rozwoju with their footnotes; dabar–Amazon footnote; PPT responsibility footnote on service pages.
- Visual: DESIGN.md colours/spacing/motion; no carousel, marquee, parallax, count-up. CJK fallback stack and `:lang(zh)` rules from spec §5.
- Contact: placeholder `office@motulen.example`, `+48 000 000 000`, `Polska / Poland — adres wkrótce` style placeholders, flagged in handover.
- Photos: only `public/img/stock/*.jpg`, mapping from spec §4.1.

## Review Focus

1. Language switch on every page lands on the same page in the other language (incl. service detail) — verify script checks every `hreflang` alternate exists in `dist/`.
2. Long Polish words overflow in big type (market row, service index, h1) — screenshot both languages at 390px; CSS uses `overflow-wrap: anywhere` on display type and `hyphens: auto` with `lang="pl"`.
3. Base-path rewrite: links/images must work under `/motulen-website/` — build once with `BASE_PATH=/motulen-website` and check no `href="/zh/` remains.
4. JS-off / reveal: content must not stay invisible — `.reveal` only hides when `html.js` is set by an inline script.
5. Leftover old brand text — verify script greps dist for `RECON|recon.org|AIoT|BHP|Safety culture|/en/`.

---

### Task 1: Verification script (the test)

**Files:** Create `scripts/verify.mjs`; Modify `package.json` (add `"verify": "node scripts/verify.mjs"`).

- [ ] Step 1: Write `scripts/verify.mjs` that reads `dist/` and fails (exit 1, list of messages) unless:
  - pages exist for both langs: `''`, `about/`, `services/`, `approach/`, `projects/`, `contact/`, and `services/{id}/` for the 6 ids `operations-outsourcing, warehouse-engineering, commercial-spaces, recruitment, robotics-service, cross-border-teams` (24 `index.html` + root);
  - every page's `<link rel="alternate" hreflang>` targets resolve to a file in dist;
  - no file in dist matches `/RECON|recon\.org|AIoT|BHP|Safety culture|href="[^"]*\/en\//`;
  - `grep -r "t(lang" src` is empty;
  - zh robotics page contains `本页为发展规划`; zh about page contains `不代表`; zh projects page contains `dabar`.
- [ ] Step 2: `npm run build && npm run verify` → expected FAIL (old site).
- [ ] Step 3: Commit `test: add dist verification script`.

### Task 2: Content model + Chinese content + site.json

**Files:** Rewrite `src/lib/content.ts`; rewrite `src/content/site.json`; create `src/content/zh/{ui,home,about,services,approach,projects,contact}.json` and `src/content/zh/services/{6 ids}.json`; delete `src/content/en/`, `src/content/pl/` (recreated in Task 6), `src/lib/areas.ts`, `src/components/inner/photos.ts`, `src/components/Blocks.astro`.

**Interfaces (Produces):**
- `LANGS`, `Lang`, `otherLang(lang)`, `site`, `getUi(lang)`, `getHome(lang)`, `getAbout(lang)`, `getApproach(lang)`, `getProjects(lang)`, `getContact(lang)`, `listServices(lang): Service[]` (ordered by `services.json` `order`), `getService(lang, id)`.
- `Service = { id, number: "01".."06", title, short, subtitle, status: 'current'|'planned', photo, alt, groups: {title, items: string[]}[], note }`.
- `Markets` live in `about.json` as `markets: {name, local, role: 'base'|'coverage'}[]`; home reads them via `getAbout`.
- `Approach` = `{ title, description, lede, photo, alt, eyebrow, headline, stages: {title, items[]}[], stagesNote, valuesTitle, values: {title, items[]}[] }`; home reads stages/values from it.
- `Ui` = nav labels (`home, about, services, approach, projects, contact`), `langName {zh, pl}`, `cta {contact, more, allServices, next}`, `status {planned}`, `roles {base, coverage}`, section tags (`servicesTag`… English mono labels), `footer {tagline, rights}`, `pageNote` (PPT responsibility footnote).
- `Home` = `{ title, description, hero {headline, sub, photo, alt}, facts {k, v}[], statement {tag, text}, services {tag, headline}, band {photo, alt, text}, markets {tag, headline, note}, approach {tag, headline}, values {tag, headline}, closing {headline, sub} }`.
- About = `{ title, description, lede, photo, alt, intro {tag, headline, text}, markets, marketsTag, marketsHeadline, marketsNote, operating {headline, columns[3], rows string[][], note}, team {tag, headline, groups {title, text, items[]}[], footer}, band {photo, alt, text} }`.
- Projects = `{ title, description, lede, photo, alt, columns[3], rows string[][], note }`. Contact = `{ title, description, lede, photo, alt, labels {email, phone, address} }`.
- `site.json` = `{ brand {name, short}, contact {email, phone, address}, languages, defaultLanguage: 'zh' }`.

- [ ] Step 1: Write schemas + loaders; zod errors name the file (keep existing `load()`).
- [ ] Step 2: Write zh JSON from spec Appendix A. Service subtitles/groups = PPT slide wording; 05 note = `本页为发展规划，不作为现有维修资质或已完成维修项目的声明。`; 06 note per spec §4.1; operating note per spec §4.3; projects note = PPT slide 14 note + `dabar–Amazon 项目不代表与 Amazon 直接签约。`; missing years = `""`.
- [ ] Step 3: Commit `feat: MOTULEN content model and Chinese content` (pages still old → build may fail; acceptable inside this task only if Task 3 follows immediately — otherwise stub pages).

### Task 3: Base, global CSS, Nav, Footer

**Files:** Modify `src/layouts/Base.astro`, `src/styles/global.css`, `src/components/Nav.astro`, `src/components/Footer.astro`; create `public/favicon.svg`; delete `public/img/logo.jpg` and old image dirs (`about, clients, gallery, home`, service dirs) — keep `public/img/stock/`.

- [ ] Step 1: Base: `<html lang={lang === 'zh' ? 'zh-CN' : 'pl'}>`, hreflang `zh-CN`/`pl`, favicon svg, inline `<script>document.documentElement.classList.add('js')</script>` in head; `.reveal` hidden only under `.js`.
- [ ] Step 2: global.css: font stacks with `"PingFang SC","Hiragino Sans GB","Microsoft YaHei","Noto Sans SC"` after Latin; `:lang(zh)` → headings `letter-spacing:0; font-weight:600; line-height:1.2`, body `line-height:1.75`; `:lang(pl)` display type `hyphens:auto; overflow-wrap:anywhere`. Add `.tag` (mono `01 / SERVICES` label).
- [ ] Step 3: Nav: wordmark text `MOTULEN GROUP`, links from ui.json, language switch shows other language's name (`中文` / `PL`), contact button. Footer: wordmark, tagline, nav, contact, `© {year} MOTULEN GROUP`.
- [ ] Step 4: Commit.

### Task 4: Shared components + Home

**Files:** Create `src/components/{SectionHead,ServiceIndex,PhotoBand,ClosingBand,Stages}.astro`; rewrite `src/pages/[lang]/index.astro`; modify `src/pages/index.astro` only if redirect breaks.

- `SectionHead {tag, headline, num?}`; `ServiceIndex {lang, services}` — six full-width rows: mono number, title, short, `发展中` chip for planned, arrow; desktop hover reveals that service's photo in a fixed right-side frame (pure CSS `:hover` per row, opacity 200ms); `PhotoBand {photo, alt, text}` edge-to-edge ≤560px with DESIGN gradient; `ClosingBand {headline, sub, cta, href}` navy; `Stages {stages}` three columns joined by one hairline, big mono numbers.
- [ ] Step 1: Home order (spec §5.1-1): hero → facts strip → statement → ServiceIndex → PhotoBand → markets row (huge names, role labels, note) → Stages + link to approach → values (5 items, compact grid) → ClosingBand.
- [ ] Step 2: `npm run build`; screenshot `/zh/` and `/pl/` at 1440 and 390; fix overflow.
- [ ] Step 3: Commit.

### Task 5: Services index + detail

**Files:** Rewrite `src/pages/[lang]/services/index.astro`, `src/pages/[lang]/services/[slug].astro`; rewrite `src/components/inner/PageHeader.astro` (add `overlay` variant: photo full-bleed, title/subtitle bottom-left on gradient); delete `src/pages/[lang]/services/c/`.

- [ ] Step 1: Index = PageHeader + ServiceIndex + ClosingBand.
- [ ] Step 2: Detail = overlay header (number, title, subtitle, planned chip) → desktop two-column: left sticky short nav of 6 services (current blue), right groups as 2–3 column lists + note → full-width "下一项业务" link to next service (06 wraps to 01) → ClosingBand.
- [ ] Step 3: Build, screenshot one current + one planned page in both langs; commit.

### Task 6: About, Approach, Projects, Contact; delete old pages

**Files:** Rewrite `src/pages/[lang]/{about,contact}.astro`; create `src/pages/[lang]/{approach,projects}.astro`; delete `src/pages/[lang]/{gallery,clients,safety-culture}.astro`.

- [ ] Step 1: About: header → intro statement → markets (reuse home market row markup via a `Markets` component) → operating table + note → team groups (3 columns) + footer line → PhotoBand → ClosingBand.
- [ ] Step 2: Approach: header → headline → Stages (full items) + stagesNote → values grid → ClosingBand. Projects: header → table (3 cols, stacked rows on mobile) + note → ClosingBand. Contact: header → email/phone/address big links.
- [ ] Step 3: Build; commit.

### Task 7: Polish content

**Files:** Create `src/content/pl/**` mirroring `zh/` exactly (same keys, ids, photos, row counts).

- [ ] Step 1: Delegate translation to a Sonnet subagent: faithful, plain business Polish, no added claims; keep company/project names; `—` stays.
- [ ] Step 2: Main model reviews compliance sentences and headlines; build; `npm run verify` → PASS.
- [ ] Step 3: Commit.

### Task 8: Docs, QA, deploy

**Files:** Modify `README.md` (content model, langs), `DESIGN.md` (Product Context → MOTULEN, CJK typography, §5.1 patterns, Decisions Log row 2026-11-04), `src/content/site.json` unchanged; delete `scripts/scrape.py`, `scripts/scrape-report.md`, `scrape` npm script.

- [ ] Step 1: `BASE_PATH=/motulen-website SITE_URL=https://robertwang4.github.io npm run build && npm run verify` → PASS; `grep -r 'href="/zh/' dist | head` → empty.
- [ ] Step 2: Screenshot all 12 page types × 2 langs at 1440 and 390; fix defects.
- [ ] Step 3: Commit; push `main`; confirm Actions run succeeds and live URL returns 200 for `/zh/` and `/pl/`.
