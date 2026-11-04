# The World of Tarunya

An original, scroll-driven miniature world portfolio. React 19, TypeScript, Vite, React Three Fiber 9, Drei and GSAP ScrollTrigger.

## Run

```sh
npm install
npm run dev
npm run build
npm run verify
npm run preview
```

## Architecture

Normal and Dream are independent component trees. The default Normal experience does not preload Three.js. Enter Dream explicitly, or use `?mode=dream`. Browser Back/Forward restores the selected mode. Reading mode is a separate accessibility option within Dream.

- `src/App.tsx`: mode selection and lazy Dream loading.
- `src/NormalPortfolio.tsx`: standalone editorial HTML portfolio.
- `src/DreamExperience.tsx`: cinematic journey and district interface.
- `src/data/portfolio.ts`: editable profile, projects, achievements, chapters and campaign.
- `src/experience/controller.tsx`: single DOM scroll source; mutable progress and discrete UI state.
- `src/experience/cameraRoute.ts`: authored GSAP keyframes for camera position, gaze, and FOV.
- `src/experience/CameraRig.tsx`: applies the GSAP pose to the R3F camera once per frame.
- `src/experience/World.tsx`: procedural geometry, reused vegetation instances and interactive landmarks.
- `src/experience/WorldCanvas.tsx`: persistent WebGL surface, lighting, error fallback and visibility handling.
- `src/interface`: accessible native dialogs and campaign tabs.
- `AGENTS.md` and `CONTEXT.md`: instructions and current handoff state.

Geometry is original, generated in code. No remote model downloads or API keys are required. Fonts are bundled locally. Reading mode works without the 3D layer. All key content and landmark actions are available in HTML.

Native page scrolling drives GSAP ScrollTrigger. ScrollTrigger scrubs one reversible GSAP timeline for camera position, gaze target, and FOV. Scroll refresh restores its playhead from current scroll. The Canvas stays mounted across chapter changes. Repeated trees use instancing; pixel ratio is capped and rendering pauses in hidden tabs. No performance score is claimed.

Project graphics are architecture illustrations, not fabricated screenshots. GSoC and mentorship descriptions are applicant-supplied; volatile counts and unsubstantiated performance metrics are intentionally excluded. See `docs/CONTENT-SOURCES.md`.

## Submission

See `docs/SUBMISSION.md` for the official requirements and applicant-owned remaining items. Building this site does not by itself prove voice usage or submit an application.
