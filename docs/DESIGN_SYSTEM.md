# Design system: reference-led astronaut portfolio

_2026-11-20. Source of truth for every chapter. Based on the uploaded reference (large central astronaut, asymmetric editorial type, hairline column grid) and the white-sky direction. Assets: [media/ASSET_MANIFEST.md](media/ASSET_MANIFEST.md)._

## 1. Visual audit: current prototype vs reference

| Aspect | Current `prototype/universe/` | Reference | Change |
|---|---|---|---|
| Hero composition | Text column left; a small photo on the right half | Astronaut huge and central; text in four zones around it | Astronaut spans the middle 4 of 8 columns, at full hero height |
| Grid | Invisible | 7 hairline vertical lines (8 columns) through the whole composition | Visible hairline grid across the page; every block starts on a line |
| Headline type | Light 300 Geist, very large; serif statement under it | Medium-weight grotesk, tight leading (about 0.9), tight tracking | Geist 500, −0.045em, line-height 0.9 |
| Supporting text | Sentence-case body plus mono labels | Small UPPERCASE blocks with two-tone words | Small caps blocks (Geist 500, 12px) with muted/bright word contrast |
| Navigation | Mixed-case links, pill CV button, progress line | Uppercase links in the top centre; bordered rectangular button top-right | Exactly that |
| Colour | Deep space with a warm amber accent; different art palettes per chapter | Monochrome with cool blue light | One cool palette, no warm accent; white-sky and space environments only |
| Imagery | Seven artworks, mixed realism and styles | One cinematic, art-directed figure | One coherent, art-directed image family (see §6) |
| Interaction cue | Mono "scroll" line | Circular "Discover ↓" button, bottom centre | Circular button, 1px ring |

What is already fine and stays: natural page scrolling (verified to the bottom at 1440/820/390px, with no overflow or locks), the eight-chapter content, the sticky nav with progress, OpenSeadragon zoom for large masters, reduced-motion support, and the verification scripts.

## 2. Typography

**Families:** Geist Sans (variable 300–700) for headings and body. Instrument Serif only for at most one editorial statement per chapter, in italic. Geist Mono only for small technical labels. No other faces.

| Role | Family / weight | Size (375px → 1440px) | Leading | Tracking |
|---|---|---|---|---|
| Display (hero headline, closing statement) | Geist 500 | clamp(2.75rem, .8rem + 4.8vw, 5.25rem): 44 → 82 | 0.90 | −0.045em |
| Statement (big facts, lower-right in hero) | Geist 500 | clamp(2.25rem, .8rem + 3.4vw, 4rem): 36 → 62 | 0.95 | −0.04em |
| Heading L (chapter titles) | Geist 500 | clamp(2rem, .9rem + 2.7vw, 3.25rem): 32 → 52 | 0.95 | −0.035em |
| Heading M (block titles) | Geist 500 | clamp(1.25rem, 1rem + .8vw, 1.5rem): 20 → 24 | 1.15 | −0.02em |
| Body | Geist 400 | 15 → 16px | 1.5 | 0 |
| Caps block | Geist 500 UPPERCASE | 12px | 1.2 | +0.01em; words alternate ink / muted |
| Nav | Geist 500 UPPERCASE | 12.5px | 1 | +0.04em |
| Label | Geist Mono 500 UPPERCASE | 11px | 1.4 | +0.06em |
| Editorial statement | Instrument Serif italic | 24 → 40px | 1.15 | −0.01em |

## 3. Grid and alignment

- **8 columns**, page margin `max(20px, 4.5vw)`, no gutters. Columns are separated by 7 hairlines (1px; light `rgba(13,23,38,.10)`, dark `rgba(170,190,230,.10)`). The lines run the full page height, behind the content.
- Every text block starts on a column line. Hero zones: headline in columns 1–3 (top); intro under it in columns 1–2; astronaut centred over columns 3–6; heading and caps block in columns 7–8 (top); connect block in columns 1–2 (bottom); statement in columns 7–8 (bottom); Discover ring on the column 4/5 line.
- Tablet (≤1100): 8 columns. Phone (≤600): 4 columns, and zones stack in reading order.

## 4. Colour

| Token | Sky environment (primary) | Space environment (selective) |
|---|---|---|
| ground | #EEF3F8 → #DFE8F1 | #04060B → #0A1222 |
| ink | #0D1726 | #F3F5F9 |
| ink-2 | #34465F | #C9D2E3 |
| muted | #7A8BA3 | #7D8DAE |
| line | rgba(13,23,38,.10) | rgba(170,190,230,.10) |
| accent (one, cool) | #3E6CA8 | #8FB3E6 |
| border | rgba(13,23,38,.55) | rgba(255,255,255,.7) |

No warm accent, gradient text or neon. White type only where the image is dark enough to contrast with it; in the sky environment the ink is deep navy.

## 5. Spacing

8px base. Tokens: 4 · 8 · 16 · 24 · 40 · 64 · 104 · 168. Chapter padding is 168px on desktop and 104px on phone. Heading to body: 24; between blocks: 40–64.

## 6. Imagery (art direction)

- **Look:** a photoreal astronaut floating in a bright white and pale-blue sky, with voluminous clouds, soft sun haze, mist and silver-blue shadows. Editorial negative space is kept for type. All images form one family: same light, grade, lens feel and palette.
- **Not used as primary visuals:** raw NASA or scientific photographs (reference only), generic stock, illustrations, anything that looks obviously AI-made, and anything watermarked or unlicensed (Behance, ArtStation and Adobe Stock previews are copyrighted unless licensed).
- **Required set (one family):** (1) hero, astronaut central in clouds, 16:9 and 4:5; (2) cloud sea with sun rays; (3) mist or smoke plate (transition layer); (4) high-altitude pale sky; (5) one dark-environment plate for the space chapters; (6) a quiet cloud plate for the closing.
- **Technical:** masters are kept untouched in `media/`. Web derivatives are WebP at 1280, 2560 and 3840 (only up to the master's true size; never upscaled).
- **Integration:** no cards or frames. Edges dissolve into the environment through masks. Layers, back to front: L0 environment · L1 photo fragments · L2 atmosphere · L3 hairline grid · L4 content · L5 navigation.
- **Fragment system:** the hero image is tiled to the column grid (8 × 5 on desktop, 4 × 6 on phone) from one file through `background-position`, so it downloads once and keeps full photographic quality (no vector tracing). Tiles assemble on load, staggered from the astronaut outward. Scrolling parts them toward the next chapter, and they lift slightly near the cursor. With reduced motion, the image is shown assembled and static.

## 7. Navigation

Name top-left (Geist 600, uppercase, 15px); 5 uppercase links centred; a bordered "Download CV" button top-right (1px, radius 8px). Sticky after the hero on the current environment's ground, with a 1px progress line. On phones, a "Menu" button opens a full-width list.

## 8. Chapter compositions (same zones, varied arrangement)

1. **Hero:** sky; astronaut centred; four text zones; Discover ring.
2. **Journey:** sky; story in columns 1–4, principles in columns 6–8; fragments part between them.
3. **Domains:** sky to space. Seven domains in a hairline 2 × 4 matrix (text between the lines, no cards) and one serif statement.
4. **Missions:** space. Text in columns 1–4 and a sticky visual in columns 5–8, alternating sides.
5. **Skills:** space. Constellation map across all 8 columns, then capability columns on the grid.
6. **Experience:** space. Timeline on the column-2 line, roles in columns 3–7.
7. **Beyond:** space to sky. A full-bleed plate with the statement in columns 1–4.
8. **Contact:** sky. A large statement across columns 1–6, links in columns 7–8.

## 9. Motion

Reveal: opacity plus 24px rise over 900ms on `cubic-bezier(.2,.7,.1,1)`. Fragment assembly takes 1.4s, staggered. Scroll drives camera scale (1 → 1.06) and the parting of fragments. Only transforms and opacity are animated. Everything respects `prefers-reduced-motion`. No scroll-jacking: native scrolling at all times.
