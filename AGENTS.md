# Project instructions

Build The World of Tarunya, an original 3D portfolio for the Wispr Flow hiring challenge. Critically assess requirements; do not invent achievements or metrics.

## Read first
- `CONTEXT.md`: current implementation state, decisions, verification and remaining tasks. Update before ending each substantial work session.
- `docs/BRIEF.md`: source brief and scope.
- `docs/CONTENT-SOURCES.md`: verified/supplied content and caveats.
- `docs/SUBMISSION.md`: challenge requirements and outstanding applicant tasks.

## Architecture
React 19 + R3F 9, Three.js, Drei, GSAP, Vite, TypeScript, Tailwind v4. Normal and Dream remain separate component trees; Normal must not import Three.js, R3F, the scene, or the experience controller. A first-visit Enter gate provides the user gesture for optional ambient audio. Wake/Normal and Dream remain reachable through a persistent mode switch. Dream is a full-screen, scroll-driven third-person chase story: a fixed transparent Canvas and camera route are scrubbed by the same page scroll as the HTML story chapters. No free orbit or zoom controls. Scroll reversal must retrace the camera and story smoothly. `cameraRoute.ts` owns authored route poses; `WorldCanvas.tsx` animates the camera and parallax atmosphere from scroll progress. The traveler is part of the authored Dream atmosphere plate. Never store frame-by-frame values in React state. React state handles chapters, dialogs, mode and sound. World geometry must not import marketing copy. All biography, project and campaign copy belongs in `src/data/portfolio.ts`.

## Quality
Keep all essential information in accessible HTML. Provide keyboard equivalents for 3D controls, reduced motion and a reading mode with no WebGL requirement. Project dialogs must trap focus, restore focus, and close with Escape. Mobile text must remain readable. No invented analytics, performance scores, users, or growth results. Proposed campaign numbers are experimental assumptions, explicitly labelled.

## Commands
`npm install`, `npm run dev`, `npm run build` (TypeScript + production bundle).

## Handoff
Record changed files, commands actually run, browser observations, unresolved issues and exact deployment status in CONTEXT.md. Do not mark incomplete submission tasks done. Do not commit credentials, node_modules, or dist.

## Modes
Wake/Normal and Dream are distinct experiences, not themes of one component tree. Normal must not import Three.js, R3F, the scene, or the experience controller. `App.tsx` lazy loads Dream. Mode is encoded as `?mode=normal|dream`; Back/Forward must work and returning to Wake restores the prior scroll position. The Dream story's accessible reading mode remains available without WebGL or audio.

User explicitly authorized pushing major milestones to origin/main. Keep commits focused and context current. User favors fast, token-efficient execution. Parallel bounded work is authorized.
