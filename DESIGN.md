# Design system

The portfolio is a two-part experience: **Wake** is an editorial portfolio with a cursor-responsive sculpture; **Dream** is a full-screen, scroll-driven chase story. The Wake/Dream control stays available throughout Wake and in Dream's story overlay. These are distinct atmospheres within one identity.

## Wake

- **Composition:** spacious editorial grid; sparse persistent navigation; oversized typography; one custom sculptural focal image; selected project evidence arranged in varied, open layouts rather than repeated cards.
- **Palette:** warm paper `#F4F0E8`, near-black plum `#241F2D`, quiet gray `#716474`, restrained amethyst/violet refracted in the sculpture, warm copper as a small signal accent. Green is not a portfolio accent.
- **Typography:** variable sans for navigation, body, and utility; Instrument Serif for occasional editorial contrast. Headings use confident scale and short lines. Small metadata stays legible and sparse.
- **Pointer interaction:** cursor position tilts the sculpture slightly and moves a low-opacity violet light field; no sudden color wash. Touch uses slow, reduced ambient movement.
- **Navigation:** fixed/global Wake ↔ Dream switch remains available at all page positions. Sound control remains reachable; returning from Dream restores the previous Wake scroll position.

## Dream

- **Threshold:** nearly black, quiet screen with one clear `[ ENTER ]` action. Keyboard Enter, click, and tap all work. The user may start with sound or remain silent; sound never starts before an intentional gesture.
- **World:** full-viewport continuous corridor with a cinematic atmosphere plate, transparent live arch geometry, desktop skyline landmarks, and synchronized parallax. No aerial island, map-driven detours, orbit, pan or zoom.
- **Scroll story:** native page scroll drives one GSAP timeline for camera, atmosphere and story beats. It is reversible. Story copy stays short and semantic HTML. A separate reading path works without WebGL or audio.
- **Narrative:** greeting → origin → projects/workshop → skills → open-source proof → Signal Lab → closing horizon. A father chapter stays out until the user supplies its true content.
- **Ending:** brief light/particle flourish, route visually resolves into the opening motif, and an explicit replay action restarts the experience. Do not forcibly jump the document to the top.

## Materials and motion

- Prefer authored curves, continuous forms, material variation and composed light over piles of unrelated primitives.
- Keep motion tied to scroll progress, hover intent, or the opening gesture. Camera and story panels move in one authored sequence; reverse scrolling retraces it.
- Reduced-motion users receive stable camera poses and readable, navigable chapters without surprise motion.
- Performance constraints: keep Normal free of 3D imports; lazy-load Dream; reuse/instance repeated meshes; avoid overdraw and expensive postprocessing.

## Reference assets

- `public/images/wake-sculpture.png` — generated sculpture source for the Wake hero.
- `docs/art-direction/dream-corridor-reference.jpg` — generated composition/material reference only.
- Exact image prompts and source notes: `docs/art-direction/IMAGE-PROMPTS.md`.

## Quality bars

- The opening viewport communicates who this is and what to do without crowding the sculpture.
- Project rows tell a compact problem/approach/result story using only verified facts.
- The Dream route has a clear vanishing point and recognisable authored transitions; details support the route rather than compete with it.
- Sound is optional and has persistent visible state.
- No exact assets, copy, or branding from the inspiration site are reused.
