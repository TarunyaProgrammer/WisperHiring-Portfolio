# Production readiness record

Updated 2026-11-04.

## Automated checks

- `npm run build` passed: strict TypeScript and Vite production output.
- `npm run verify` passed: Normal SSR/content, lazy 3D entry, production assets, district poses, and reversible GSAP flight samples. Vite logged a sandbox `listen EPERM` WebSocket warning while running the verifier; assertions completed and passed.
- `git diff --check` passed.
- Current scene chunk: 932.64 kB minified / 253.76 kB gzip; Vite emits its >500 kB chunk warning. This is a bundle size warning, not a measured runtime failure.

## Implemented and code-reviewed

- Normal and Dream are separate route-like experiences; Dream loads lazily.
- Dream is a full-screen Canvas without persistent editorial copy. OrbitControls provide direct mouse, keyboard and touch camera exploration; icon-only controls expose exit, reading mode and map. District map choices command GSAP camera position, target and lens flights. Reading mode contains the long-form story.
- Interactive buildings open contextual profile, project, achievement and campaign details. Drei HTML labels have pointer events disabled at the overlay layer so the underlying 3D object can receive pointer input.
- Reduced motion, error boundaries, WebGL context loss/restore, hidden-tab pause, RAF cancellation, stable route data, touch target/safe-area handling and dialog keyboard/focus behavior have implementation coverage.
- Palette now uses plum, rose and warm ivory in Normal mode; Dream keeps natural vegetation.

## Browser QA status

- The private registered Sites URL returns 401/sign-in required. No public deployment was attempted; user said “Keep local and GitHub only.” Deployed-site verification is therefore unavailable.
- Local preview at 4173: Dream has one full-viewport Canvas and no persistent story copy. District map → Signal Lab visibly flies from aerial overview to beacon framing and closes the map. Tapping the beacon at 360×732 opens campaign details. Cabin opens with keyboard focus + Enter. Reading mode removes Canvas and exposes the story. Returning to Normal updates `mode=normal`; browser Back restores Dream.
- Local mobile: Dream at 360px and Normal at 390px had no horizontal overflow. Canvas landmark tap reached the 3D object. Tested route/interactions produced zero console warnings/errors.
- The initial Playwright attempt treated a Drei label as a pointer target; that was incorrect because its HTML overlay intentionally has `pointerEvents="none"`. Keyboard activation and direct object pointer input both work.
- These checks cover representative interactions and emulated viewport sizes, not all browsers/devices or visual fidelity. No frame-rate/performance score is claimed.

## Applicant-owned items

Voice sample, application video, role/availability confirmation, and grant choice remain in `docs/SUBMISSION.md`.
