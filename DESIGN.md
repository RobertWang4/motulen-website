# Design System — AIoT P.S.A.

## Product Context
- **What this is:** Corporate website for MOTULEN GROUP, a Poland-based European enterprise-services company: staffing and operations outsourcing, warehouse engineering, commercial fit-out, headhunting (incl. talent from China), with warehouse-robot service and cross-border teams in development. Bilingual **Chinese / Polish**, 24 static pages, content from JSON. Source of all copy: the company's Chinese corporate deck.
- **Who it's for:** Overseas (mainly Chinese) companies building or running operations in Europe, and Polish/European employers needing staff and site services. Often opened from a link sent after a first conversation.
- **Space/industry:** Cross-border B2B services (HR outsourcing, logistics, site works).
- **Project type:** Marketing site, six business-line pages.

## Aesthetic Direction
- **Direction:** Industrial modernism — white ground, large photography, precise typography.
- **Decoration level:** minimal. Type, whitespace and photographs do all the work.
- **Mood:** Modern, intelligent, leading — expressed through restraint and precision, never through effects. Calm authority, tender-ready.
- **Reference:** https://www.xchanneltech.com (white ground, simple nav, full-width photo bands, few words, dark footer).
- **Anti-references (rejected by the user):** dark navy-scrim cinematic pages, serif italic accents, marquees / ken-burns / parallax / count-ups, gradient card grids, heavy blue surfaces, dense copy.

## Typography
- **Display/Hero:** Satoshi 700 (Fontshare) — geometric, modern, distinctive without being loud. Headlines sentence case, letter-spacing −0.02 to −0.025em, line-height 1.02.
- **Body:** Instrument Sans 400/500/600 (Google Fonts) — clear, neutral, pairs with Satoshi's geometry. Line-height 1.6.
- **UI/Labels:** Instrument Sans 500/600.
- **Data / numerals / eyebrows:** IBM Plex Mono 400/500 (Google Fonts), 12px, letter-spacing .12em, uppercase, tabular-nums. Used sparingly: section numbers (01–10), credentials strip, counts, eyebrow labels. Never for running text.
- **Chinese:** no CJK webfont. Every stack falls back to `"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans SC"` after the Latin face. Under `:lang(zh)`: headings weight 600, letter-spacing 0, line-height 1.2; body line-height 1.75. Width limits for Chinese headings use `em`, not `ch`.
- **Polish:** no automatic hyphenation on display type; `overflow-wrap: break-word` only.
- **Loading:** `https://api.fontshare.com/v2/css?f[]=satoshi@500,700&display=swap` and `https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap`. Fallback stacks: system-ui / ui-monospace.
- **Scale:** h1 clamp(40px, 6vw, 84px) · h2 clamp(30px, 3.8vw, 52px) · h3 24px · lede 20px · body 16px · small 14px · label 12px mono.

## Color
- **Approach:** restrained — white with blue accents ("白蓝，白色为主，蓝色点缀").
- **Ground:** white #FFFFFF; surface #F5F6F8 (quiet bands, alerts); line #E5E7EB (hairlines).
- **Ink:** #0E1116 text; muted #5B6270 secondary text; faint #9AA0A9 labels.
- **Accent blue:** #2F6BFF — primary CTA, link hover, active nav item, section numerals, one highlighted word in a headline at most. Hover #1F55DB. Never as a large background.
- **Navy:** #0B1B4A — footer and the single closing band only.
- **Photo overlay:** on hero/photo bands with text, a gradient from rgba(14,17,22,.55) at the text side to transparent — enough for AA contrast on white text, no full navy wash.
- **Semantic:** success #1F8A4C, warning #B7791F, error #C0392B, info #2F6BFF.
- **Dark mode:** none (light only).

## Spacing
- **Base unit:** 8px.
- **Density:** spacious.
- **Scale:** xs 4 · sm 8 · md 16 · lg 24 · xl 32 · 2xl 48 · 3xl 64 · 4xl 96 · section clamp(72px, 10vw, 144px).

## Layout
- **Approach:** grid-disciplined. 12 columns, 32px gutters.
- **Max content width:** 1360px; page gutter clamp(24px, 5vw, 88px). Photo bands break out edge to edge.
- **Home hero:** full-bleed photograph, ~80vh (max 860px), headline and one CTA overlaid bottom-left on the gradient; credentials strip (Since 2008 · ISO certified · PCA accredited · 10 disciplines · 37 services) directly below.
- **Inner page header:** white type block (mono eyebrow, h1, lede) then an edge-to-edge photo band ≤ 640px tall.
- **Section anchor pattern:** oversized mono numeral (01, 02…) in `line` grey beside the h2.
- **Border radius:** sm 2px (images), md 4px (buttons, inputs); no pill shapes, no large radii.
- **Copy budget:** home ≤ 60 words of body text; one idea per section; depth lives on subpages.

## Page Patterns (2026-11-04)
- **Mono section tag:** `02 / SERVICES` in Plex Mono above every h2 (number in blue). Tags are English on both language versions.
- **Statement screen:** one positioning sentence set at clamp(32px, 5vw, 76px), nothing else.
- **Business index:** six full-width numbered rows with hairlines; desktop shows the hovered row's photo in a sticky frame (CSS `:has()`, opacity 200ms). Planned lines carry a quiet grey chip.
- **Markets row:** five country names in large type; Poland marked "base" with a blue top rule. No map, so nothing implies offices.
- **Stages:** three columns joined by one hairline with blue dots and large `line`-grey numerals.
- **Service detail:** photo header with title overlaid; sticky six-item side nav; grouped lists with blue dash bullets; full-width "next service" link.
- **Footnotes:** compliance and scope notes use `.note` (14px muted) and are never hidden.

## Motion
- **Approach:** minimal-functional.
- **Allowed:** opacity/translateY(12px) reveal on scroll via IntersectionObserver; hover colour/underline; image hover scale ≤ 1.03.
- **Page transitions (2026-11-04):** cross-document view transition. Old page fades out 180ms ease-in, new page fades up 12px over 360ms ease-out; the header does not animate. Links prefetch on hover.
- **Forbidden:** marquees, ken-burns, parallax, count-ups, drag rails, scroll-pinned sections.
- **Easing:** enter ease-out, exit ease-in, move ease-in-out. **Duration:** micro 100ms · short 200ms · medium 350ms · long 600ms (reveals).
- Respect `prefers-reduced-motion`: reveals render immediately.

## Accessibility
- WCAG AA contrast (muted text on white ≥ 4.5:1 — #5B6270 passes; #9AA0A9 only at ≥ 18px or for non-essential labels).
- All navigation keyboard-reachable with visible focus (2px blue outline offset 2px).
- Every image has alt text; decorative photo bands use empty alt.

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-09-13 | Initial design system created via /design-consultation | Based on user brief: white-dominant, minimal, "现代、智能、领先", tender-ready; reference xchanneltech.com |
| 2026-09-13 | Font: Satoshi chosen over Geist / General Sans / Cabinet / Clash / Manrope | User picked A from demo/font-preview.html |
| 2026-09-13 | Hero: full-bleed photo with overlaid text (not split layout) | User preference |
| 2026-11-04 | Page crossfade + hover prefetch; market names smaller and on one line | User: switching pages felt abrupt; 罗马尼亚 wrapped |
| 2026-11-04 | Rebrand to MOTULEN GROUP, languages zh + pl, page patterns above | User: keep this visual style, rebuild from the MOTULEN deck, make it more 大气 while telling the story |
| 2026-09-13 | Colour: white primary, blue as accent beyond just the CTA | User: "白蓝，白色为主，蓝色点缀" |
