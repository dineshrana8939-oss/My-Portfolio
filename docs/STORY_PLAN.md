# Story plan: The Explorer's Universe

_Plan for review before implementation. Targeted additions to the existing site; no rebuild._

## The metaphor in one line
**I am the explorer; the professional world is the universe.** Galaxies are domains I work in, planets are real projects, missions are how I solved them, and the next frontier is what I am learning now.

## Clarity rules (recruiters first)
- The top navigation keeps plain words: Journey · Expertise · Work · Experience · Contact. Space terms appear only as small mono eyebrows above headings.
- Every chapter states the real thing in its heading. The metaphor sits in the eyebrow and the visuals, never in place of the facts.
- CV, LinkedIn and email are always one click away. No step of the journey is required to reach information.
- Only facts from the CV. Unknown project details stay as visible "needs your input" markers.

## Map: metaphor → section → what appears
| Stop (eyebrow) | Section | Metaphor made visible | Real content |
|---|---|---|---|
| MY UNIVERSE | Hero | The explorer at the edge of the clouds; the camera pushes toward them | Name, role, positioning, CTAs |
| EXPLORATION LOG | Journey | The camera rises above the ground | Background, how I solve problems |
| PROFESSIONAL GALAXIES | Expertise | Each of the 7 domains gets a fine-line celestial mark plus a coordinate (G-01…G-07) | The 7 domains, linked to their projects |
| (transition) | Ascent | Camera dives through clouds, then light, then stars | |
| MISSION ARCHIVE | Work | Each case is a **planet** inside a galaxy: "Planet · Galaxy G-0x · Status" | The 5 case studies: challenge, role, approach, systems, outcome |
| SKILL CONSTELLATIONS | Skills | Connected constellations (already built) | Capability lists |
| FLIGHT RECORD | Experience | Each role is a mission leg on the route | Verified roles and dates |
| NEXT FRONTIER | Beyond | Light breaking through clouds | Proven (●) vs exploring (○) |
| OPEN CHANNEL | Contact | The journey resolves back in the sky | Email, LinkedIn, GitHub, CV |

## The four storytelling devices to add
1. **Exploration route (signature):** a slim vertical route on the right edge on desktop, with 8 stop markers. An **explorer marker** travels down it as you scroll, so it doubles as the progress indicator. Hovering a stop shows its label; clicking jumps there. On phones it collapses into the existing progress line.
2. **Destination markers:** a distinct line-drawn celestial glyph per domain that draws itself on reveal. Hairline style, not cartoon planets.
3. **Planet headers on case studies:** "Planet · Galaxy G-0x · Mission status". The galaxy tag links back to its domain, and each domain links forward to its planets.
4. **Consistent explorer identity:** the same explorer ring sits beside the hero name, on the route and at each chapter eyebrow, connecting the astronaut, the route and every stop without explanation.

## Transitions (already built, now labelled)
Hero push-in → Journey (sky) → Galaxies (sky) → Ascent zoom (clouds, light, stars) → Mission Archive (space) → Constellations → Flight record → Next Frontier → Open Channel (back in the sky).

## Implementation scope (targeted)
- **HTML:** eyebrow relabels, a route component, 7 SVG glyphs, 5 planet headers.
- **CSS:** about 60 lines on the existing tokens.
- **JS:** about 40 lines on the existing scroll loop.
- **Not changed:** layout, images, camera system, content facts.
