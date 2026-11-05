# Design System — MOTULEN GROUP

## Product Context
- **What this is:** Corporate website for MOTULEN GROUP, a Poland-based European enterprise-services company. Five European services in two groups (people and operations: 01 HR outsourcing, 04 headhunting; engineering and technical services: 02 warehouse facilities, 03 commercial spaces, 05 robot and equipment service, planned) plus the MOTULEN global platform. Bilingual **Chinese / Polish**, static pages, content from JSON.
- **Pages:** home · About (MOTULEN GROUP, service value, success cases) · five service pages · global platform · contact.
- **Who it's for:** Overseas (mainly Chinese) companies building or running operations in Europe, and Polish/European employers needing staff and site services.
- **Space/industry:** Cross-border B2B services (HR outsourcing, logistics, site works).
- **Project type:** Marketing site.

## Aesthetic Direction
- **Direction:** Industrial modernism with a bold headline hero: white ground, precise typography, brand navy and teal.
- **Decoration level:** minimal. Type, whitespace and photographs do the work; no glow, no gradients on cards.
- **Mood:** Modern, intelligent, leading, expressed through restraint and precision.
- **Reference:** Human & Hunter hero (large headline, one paragraph, one button on a video/photo) in the client's brand colours; xchanneltech.com for the white, photo-led rest of the site.
- **Anti-references:** serif italic accents, marquees / ken-burns / parallax / count-ups, gradient card grids, dense copy.

## Typography
- **Display/Hero:** Satoshi 700 (Fontshare) — geometric, modern, distinctive without being loud. Headlines sentence case, letter-spacing −0.02 to −0.025em, line-height 1.02.
- **Body:** Instrument Sans 400/500/600 (Google Fonts) — clear, neutral, pairs with Satoshi's geometry. Line-height 1.6.
- **UI/Labels:** Instrument Sans 500/600.
- **Data / numerals / eyebrows:** IBM Plex Mono 400/500 (Google Fonts), 12px, letter-spacing .12em, uppercase, tabular-nums. Used sparingly: section numbers (01–10), credentials strip, counts, eyebrow labels. Never for running text.
- **Chinese:** headings use Noto Sans SC 700 (hero title 800), loaded from Google Fonts (`--display-zh`); PingFang only reaches Semibold, which is too light. Body stays on the system CJK stack (PingFang SC, Hiragino Sans GB, Microsoft YaHei). Under `:lang(zh)`: headings letter-spacing 0, line-height 1.2; body line-height 1.75. Width limits for Chinese headings use `em`, not `ch`.
- **Polish:** no automatic hyphenation on display type; `overflow-wrap: break-word` only.
- **Loading:** `https://api.fontshare.com/v2/css?f[]=satoshi@500,700&display=swap` and `https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&family=Noto+Sans+SC:wght@700;800&display=swap`. Fallback stacks: system-ui / ui-monospace.
- **Scale:** h1 clamp(40px, 6vw, 84px) · h2 clamp(30px, 3.8vw, 52px) · h3 24px · lede 20px · body 16px · small 14px · label 12px mono.

## Color
- **Approach:** restrained: white ground, brand navy for headings and dark surfaces, brand teal for action and accents.
- **Ground:** white #FFFFFF; surface #F5F6F8 (quiet bands, hover); line #E5E7EB (hairlines).
- **Ink:** #0E1116 text; muted #5B6270 secondary text; faint #9AA0A9 labels.
- **Navy:** #041734 (logo navy): headings on white, footer, closing band overlay, hero overlay, nav link text.
- **Teal:** #015C5F (logo teal): primary button (white text), highlighted headline word, section numerals, current/hover nav underline, link hover, focus outline, planned chip border and text, dots and rules. Hover #01474A.
- **Hero overlay:** `linear-gradient(90deg, rgba(4,23,52,.92) 0%, rgba(4,23,52,.78) 38%, rgba(4,23,52,0) 72%)`; bottom-up on mobile. Closing band: photo under rgba(4,23,52,.82).
- **Semantic:** success #1F8A4C, warning #B7791F, error #C0392B, info teal.
- **Dark mode:** none (light only).

## Spacing
- **Base unit:** 8px.
- **Density:** spacious.
- **Scale:** xs 4 · sm 8 · md 16 · lg 24 · xl 32 · 2xl 48 · 3xl 64 · 4xl 96 · section clamp(72px, 10vw, 144px).

## Layout
- **Approach:** grid-disciplined. 12 columns, 32px gutters.
- **Max content width:** 1360px; page gutter clamp(24px, 5vw, 88px). Photo bands break out edge to edge.
- **Home hero:** under the white nav, height min(88vh, 860px), min 560px. Looping muted video (poster fallback) with the people on the right; left-aligned two-line white headline clamp(44px, 6vw, 96px), a 600-weight sub line, a small paragraph and one teal button, vertically centred, over the navy left-side gradient. Polish headline is set smaller to stay on two lines.
- **Inner page header:** white type block (mono eyebrow, h1, lede), optionally followed by an edge-to-edge photo band ≤ 640px tall. Only use a photo that carries real content; value and platform pages have none (their deck images read as empty bands).
- **Navigation:** white 76px bar with a hairline, logo left; right: Home, About and European services (mega menu buttons), global platform, language, teal Contact button.
- **Section anchor pattern:** oversized mono numeral (01, 02…) in `line` grey beside the h2.
- **Border radius:** sm 2px (images), md 4px (buttons, inputs); no pill shapes, no large radii.
- **Copy budget:** home ≤ 60 words of body text; one idea per section; depth lives on subpages.

## Page Patterns (2026-11-05)
- **Mega menu:** About opens a row of three items (title + short line); European services opens two columns headed by the non-clickable group names, each service a full-width block (mono number, title, short line, planned chip) with surface hover. Full-width white panel under the bar, soft shadow, 200ms opacity/translate. Opens on hover (150ms close delay) or click; Esc closes and returns focus; one open at a time; works without JS via hover/focus-within. Under 1024px a hamburger opens a full-screen drawer with collapsible items, contact button and language at the bottom.
- **Service image groups, case list, global platform:** as before, recoloured to navy/teal; cases are anonymised.
- **Mono section tag:** `02 / SERVICES` in Plex Mono above every h2 (number in teal). Tags are English on both language versions.
- **Statement screen:** one positioning sentence set at clamp(32px, 5vw, 76px), nothing else.
- **Business index:** six full-width numbered rows with hairlines; desktop shows the hovered row's photo in a sticky frame (CSS `:has()`, opacity 200ms). Planned lines carry a teal outline chip.
- **Markets row:** five country names in large type; Poland marked "base" with a teal top rule. No map, so nothing implies offices.
- **Stages:** three columns joined by one hairline with teal dots and large `line`-grey numerals.
- **Service cards (home):** the five services as photo cards in their two groups (group name as a small teal-ruled heading) (every frame 4:3, object-fit cover, on a shared 3-column grid so all five are the same size; hover scale 1.03) joined by one hairline rail with teal dots; mono number, title with arrow, short line. Two columns under 900px, one under 600px. The numbered business index (01–06) lives on the MOTULEN GROUP page.
- **Group grid:** titled lists as in the deck's columns; a group the deck calls a development direction carries the grey "expanding" chip. Service pages may add sub-sections (headline, optional lede and 16:6 photo, group grid) — service 01 carries the team and admin & logistics sections, as in the deck.
- **Next step link:** full-width link before the closing band (mono label, large title with arrow, hairline on top; arrow nudges 8px on hover). Follows the talk track between big sections: home > about > services > projects > direction > approach > contact (the deck's page-number order). The services page and every service page point to projects; single services are switched in the side list, never by a bottom link.
- **Service detail:** no tall header. Side list of the six services and the content start right under the nav; side list is sticky at the same offset it starts at, so switching services never moves it. Content: tag, h1 + planned chip, subtitle, 16:7 photo, grouped lists with teal dash bullets, note; then the next-step link to approach. On switch only the content crossfades (view-transition names `svc-nav`, `svc-body`).
- **Footnotes:** compliance and scope notes use `.note` (14px muted) and are never hidden.

## Motion
- **Approach:** minimal-functional.
- **Hero video:** allowed (muted loop); with `prefers-reduced-motion` or data saver the poster is shown instead and the video is never loaded.
- **Menu:** panel opacity + 4px translate, 200ms.
- **Allowed:** opacity/translateY(12px) reveal on scroll via IntersectionObserver; hover colour/underline; image hover scale ≤ 1.03.
- **Page transitions (2026-11-04):** cross-document view transition. Old page fades out 180ms ease-in, new page fades up 12px over 360ms ease-out; the header does not animate. Links prefetch on hover.
- **Forbidden:** marquees, ken-burns, parallax, count-ups, drag rails, scroll-pinned sections.
- **Easing:** enter ease-out, exit ease-in, move ease-in-out. **Duration:** micro 100ms · short 200ms · medium 350ms · long 600ms (reveals).
- Respect `prefers-reduced-motion`: reveals render immediately.

## Accessibility
- WCAG AA contrast (muted text on white ≥ 4.5:1 — #5B6270 passes; #9AA0A9 only at ≥ 18px or for non-essential labels).
- All navigation keyboard-reachable with visible focus (2px teal outline offset 2px).
- Every image has alt text; decorative photo bands use empty alt.

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-11-05 | Rebuilt to the client's website brief: brand navy/teal, mega menu, Human & Hunter style hero, anonymised cases, Noto Sans SC headings | User: client's website requirements document |
| 2026-11-05 | Rebuilt on the 20-slide deck: 4 business lines, direction page, approach = cooperation + management + value; talk track follows the deck's page numbers | User: build strictly from the deck's content and logic |
| 2026-11-04 | Page crossfade + hover prefetch; market names smaller and on one line | User: switching pages felt abrupt; 罗马尼亚 wrapped |
| 2026-11-04 | Rebrand to MOTULEN GROUP, languages zh + pl, page patterns above | User: keep this visual style, rebuild from the MOTULEN deck, make it more 大气 while telling the story |
| 2026-09-13 | Initial design system created via /design-consultation | Based on user brief: white-dominant, minimal, "现代、智能、领先", tender-ready; reference xchanneltech.com |
| 2026-09-13 | Font: Satoshi chosen over Geist / General Sans / Cabinet / Clash / Manrope | User picked A from demo/font-preview.html |
| 2026-09-13 | Hero: full-bleed photo with overlaid text (not split layout) | User preference |
| 2026-09-13 | Colour: white primary, blue as accent beyond just the CTA | User: "白蓝，白色为主，蓝色点缀" |
