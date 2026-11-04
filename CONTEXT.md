# Project context

Last updated: 2026-11-04 (Asia/Kolkata).

## Objective

Build an original portfolio for Tarunya Kesharwani and the Wispr Flow hiring challenge. Keep the normal portfolio and the Dream world as distinct experiences. User wants a luxurious, distinctive normal site and a full-screen, playable Dream with no persistent story copy. User explicitly authorized local/GitHub work and milestone pushes. Do not publish or upload this content to Sites.

## Current product decisions

- React 19, TypeScript, Vite, R3F/Three.js/Drei, GSAP. `App.tsx` lazy-loads Dream; Normal does not import the 3D scene or controller.
- Normal uses a plum, rose and warm ivory editorial palette; green was rejected. Instrument Serif + Inter remain the type pairing.
- Dream is immersive edge-to-edge Canvas. No persistent story text; minimal icon-only controls open/exit, reading mode and district map. OrbitControls support drag/touch/keyboard camera exploration; districts animate with GSAP position, target and lens flights. Scroll does not move the Dream camera. Reading mode is separate accessible HTML content.
- World uses authored low-poly island geography and four districts, shared material language, distinct landmark silhouettes, interactive buildings and contextual dialogs.
- Keep all biography/project/campaign content in `src/data/portfolio.ts`; don't invent claims or metrics. Campaign projections remain labelled as proposals.
- `AGENTS.md` has implementation boundaries and handoff rules. `docs/BRIEF.md`, `docs/CONTENT-SOURCES.md`, and `docs/SUBMISSION.md` preserve source requirements and uncompleted applicant tasks.

## Current engineering work

Recent production audit/design pass includes error boundaries for lazy Dream/scene failures, WebGL loss/restore listeners with cleanup, cancelled deep-link RAF, stable geometry route data, disposed GSAP hover tweens, reduced-motion handling, mobile safe areas/touch targets, decorative icon semantics, improved dialog content and label hit testing. Removed the obsolete scroll-driven CameraRig; District flights are explicit and reversible. Normal visual design was updated away from forest green.

## Verification and limitations

- Run `npm run build`, `npm run verify`, and `git diff --check` after source changes. The verify script checks SSR/data, code-split boundary, production assets, authored poses and reversible GSAP camera behavior. It is not a substitute for browser interaction QA.
- Local Playwright QA at 4173 passed representative routes: Dream map → Signal Lab visibly flies to beacon framing; direct mobile beacon tap opens campaign details; Cabin opens by keyboard; reading mode removes Canvas; mode URL and Back work; 360px Dream and 390px Normal have no horizontal overflow; zero console warnings/errors. Drei HTML labels intentionally have `pointerEvents="none"`, allowing pointer input to reach the 3D landmark; labels remain keyboard focusable.
- The world bundle is large enough to emit Vite's chunk warning. Keep an eye on code splitting/assets; no performance score has been measured.
- Registered Sites URL requires sign-in (401); no independent deployed QA is possible. User explicitly said “Keep local and GitHub only”; do not retry deployment or upload.
- GitHub remote is `origin/main`; user requested ongoing milestone pushes. Commit only after build, verify and review. Never commit `.playwright-cli`, `dist`, credentials or `node_modules`.

## Remaining work

Interaction QA for map-to-camera travel, landmark click, reading mode, Normal/Dream history and representative mobile viewports is complete. Re-run build/verify after final style cleanup, then push to GitHub. Browser-confirmed external deployment is intentionally outstanding. Applicant-owned work in `docs/SUBMISSION.md` remains outstanding.
