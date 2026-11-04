# Project instructions

Build The World of Tarunya, an original 3D portfolio for the Wispr Flow hiring challenge. Critically assess requirements; do not invent achievements or metrics.

## Read first
- `CONTEXT.md`: current implementation state, decisions, verification and remaining tasks. Update before ending each substantial work session.
- `docs/BRIEF.md`: source brief and scope.
- `docs/CONTENT-SOURCES.md`: verified/supplied content and caveats.
- `docs/SUBMISSION.md`: challenge requirements and outstanding applicant tasks.

## Architecture
React 19 + TypeScript + Vite. One persistent R3F Canvas. A normal DOM scroll container and GSAP ScrollTrigger are the only scroll source. Continuous progress lives in a mutable controller, never React state. React state handles district changes, dialogs, and interface modes. The CameraRig owns position, look-at and FOV interpolation. World geometry must not import marketing copy. All biography, project and campaign copy belongs in `src/data/portfolio.ts`.

## Quality
Keep all essential information in accessible HTML. Provide keyboard equivalents for 3D controls, reduced motion and a reading mode with no WebGL requirement. Project dialogs must trap focus, restore focus, and close with Escape. Mobile text must remain readable. No invented analytics, performance scores, users, or growth results. Proposed campaign numbers are experimental assumptions, explicitly labelled.

## Commands
`npm install`, `npm run dev`, `npm run build` (TypeScript + production bundle).

## Handoff
Record changed files, commands actually run, browser observations, unresolved issues and exact deployment status in CONTEXT.md. Do not mark incomplete submission tasks done. Do not commit credentials, node_modules, or dist.
