# Project context

Last updated: 2026-11-04 (Asia/Kolkata).

## Objective and constraints

Build The World of Tarunya for the Wispr Flow hiring challenge. User approved a high-end editorial Wake mode and a full-screen, scroll-driven Dream story. Identity spelling confirmed as Tarunya Kesharwani. The user explicitly said keep the work local and on GitHub only; do not publish to Sites or another host. User authorized pushing major milestones.

Do not invent metrics, testimonials, campaign results, or personal history. The requested story about the applicant's father is omitted until they provide a real detail. GSoC and mentorship claims are applicant-supplied; do not imply independent verification.

## Current implementation

- `App.tsx` begins at a black `[ ENTER ]` gate. The user gesture opens Wake or Dream and can start optional looping playback of `public/audio/bgmusic.mp3`. Sound can be disabled before or after entry.
- Wake (`NormalPortfolio.tsx` and `wake.css`) is a responsive editorial page with a quiet grid, large typography, transparent sculptural artwork, cursor-follow violet facet linework and a deliberate tilt, a gentle in-view sculpture animation, project and proof narratives, Signal Lab proposal, contact links, a visible Dream CTA in the header, and the persistent bottom mode switch.
- Dream (`DreamExperience.tsx`, `dream.css`) follows seven story beats. One fixed Canvas, authored closed camera route and HTML chapter sequence track one scroll timeline. GSAP ScrollTrigger scrubs in both directions. The traveler and architecture are in a generated open-valley art plate; one stone threshold gate and round ambient particles remain as live 3D. Scroll drives the camera and story over the fixed landscape plate. There are no OrbitControls or manual zoom controls. The ending returns visually to the opening pose with a particle flourish and deliberate replay control. The large 3D landmark set remains unfinished; the background architecture is not rigged 3D.
- Dream remains lazy-loaded; Wake does not import the Three.js renderer. A reading mode presents the full story without WebGL. Reduced motion, skip links, labeled controls, responsive layouts, and a WebGL error fallback are present.
- Four fictionalized project summaries use the exact supplied repository URLs. Their architecture and learning copy is narrative explanation, not a claim of measured results.
- `DESIGN.md`, `PRODUCT.md`, `AGENTS.md`, `docs/CONTENT-SOURCES.md` and `docs/QA.md` describe the accepted design and project truth.
- Assets: `public/images/wake-sculpture.png` is used in Wake; `public/images/dream-environment.jpg` is the revised full-bleed Dream landscape plate (open causeway, mountain valley, courtyard/timber pavilion/keep silhouettes, and traveler); `public/audio/bgmusic.mp3` is applicant supplied. The original Dream image prompt and revision rationale are in `docs/art-direction/IMAGE-PROMPTS.md`.

## Verification completed this session

- `npm run build`: passes TypeScript and Vite production build. Three.js is split into its own lazy vendor chunk (about 181 KB gzip); React Three Fiber and GSAP are split separately.
- `npm run verify`: passes rendered Wake, project links, chapter order, closed Dream route, scroll timeline wiring, and production asset checks.
- `git diff --check`: passes.
- After the latest Dream art and route changes, `npm run build` and `npm run verify` pass. The replacement plate was inspected from the visitor view at opening, middle, and ending chapters; no page errors appeared. Earlier screenshots showed that the old background loops dominated the view and the added foreground buildings read as small dark props; those were removed. One threshold gate remains; attempts at two gates and a broad 3D path produced overlap/occlusion and were reverted.
- Current Impeccable scan: no critical findings; advisory font-family warnings remain.
- Local Chrome verified the cursor-following SVG facet, hero sculpture animation, visible Dream buttons, reduced-motion behavior, 390px layout, supplied MP3 request after Enter (HTTP 206), sound toggle, and navigation into Dream. No page errors.
- Headless Chrome on the local production preview opened the black Enter gate, Wake, and Dream. Chapter navigation advanced, reversed with scroll, and rendered without page errors. At 390px, Dream had no horizontal overflow. The rendered environment still benefits from visual QA on a physical mobile device and lower-powered hardware.
- No public deployment was created or checked, by user instruction.

## Remaining work

- Add a coherent set of substantial live 3D landmarks; current architecture diversity is in the generated image plate. A small Kenney CC0 watchtower was inspected and excluded because its low-poly art style clashes with the scene.
- Confirm touch scroll and audio on a physical device.
- Independently inspect a public deployed build only if the user later authorizes a hosting destination.
- Re-check applicant-owned source links and claims before public release.

## Commands

```sh
npm run dev
npm run build
npm run verify
npm run preview
```

See `docs/QA.md` for the latest evidence and known limits.
