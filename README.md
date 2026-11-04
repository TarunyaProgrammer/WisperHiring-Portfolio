# The World of Tarunya

An original, scroll-driven miniature world portfolio. React 19, TypeScript, Vite, React Three Fiber 9, Drei and GSAP ScrollTrigger.

## Run

```sh
npm install
npm run dev
npm run build
npm run preview
```

## Architecture

- `src/data/portfolio.ts`: editable profile, projects, achievements, chapters and campaign.
- `src/experience/controller.tsx`: single DOM scroll source; mutable progress and discrete UI state.
- `src/experience/CameraRig.tsx`: authored position, target and FOV keyframes.
- `src/experience/World.tsx`: procedural geometry, reused vegetation instances and interactive landmarks.
- `src/experience/WorldCanvas.tsx`: persistent WebGL surface, lighting, error fallback and visibility handling.
- `src/interface`: accessible native dialogs and campaign tabs.
- `AGENTS.md` and `CONTEXT.md`: instructions and current handoff state.

Geometry is original, generated in code. No remote model downloads or API keys are required. Fonts are bundled locally. Reading mode works without the 3D layer. All key content and landmark actions are available in HTML.

Native page scrolling drives GSAP ScrollTrigger. Camera progress is a mutable ref rather than a React frame update. Camera position and look-at target interpolate together. The Canvas stays mounted across chapter changes. Repeated trees use instancing; pixel ratio is capped and rendering pauses in hidden tabs. No performance score is claimed.

Project graphics are architecture illustrations, not fabricated screenshots. GSoC and mentorship descriptions are applicant-supplied; volatile counts and unsubstantiated performance metrics are intentionally excluded. See `docs/CONTENT-SOURCES.md`.

## Submission

See `docs/SUBMISSION.md` for the official requirements and applicant-owned remaining items. Building this site does not by itself prove voice usage or submit an application.
