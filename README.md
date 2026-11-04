# The World of Tarunya

An original portfolio with a premium editorial Normal mode and a full-screen, explorable 3D Dream mode. Built with React 19, TypeScript, Vite, React Three Fiber 9, Drei and GSAP.

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
- `src/DreamExperience.tsx`: immersive world controls, reading mode, and story panels.
- `src/data/portfolio.ts`: editable profile, projects, achievements, chapters and campaign.
- `src/experience/controller.tsx`: district travel commands, reduced-motion preference, and reading state.
- `src/experience/cameraRoute.ts`: authored destination poses for each district.
- `src/experience/World.tsx`: procedural geometry, reused vegetation instances and interactive landmarks.
- `src/experience/WorldCanvas.tsx`: persistent WebGL surface, lighting, error fallback and visibility handling.
- `src/interface`: accessible native dialogs and campaign tabs.
- `AGENTS.md` and `CONTEXT.md`: instructions and current handoff state.

Geometry is original, generated in code. No remote model downloads or API keys are required. Fonts are bundled locally. Reading mode works without the 3D layer. All key content and landmark actions are available in HTML.

Dream mode fills the viewport with the world. OrbitControls support mouse, keyboard, and touch travel; district selection flies the camera with GSAP. No page-scroll camera hijack competes with exploration. Reading mode provides the full HTML story without WebGL. Repeated trees use instancing, pixel ratio is capped, and rendering pauses in hidden tabs. No performance score is claimed.

Project graphics are architecture illustrations, not fabricated screenshots. GSoC and mentorship descriptions are applicant-supplied; volatile counts and unsubstantiated performance metrics are intentionally excluded. See `docs/CONTENT-SOURCES.md`.

## Submission

See `docs/SUBMISSION.md` for the official requirements and applicant-owned remaining items. Building this site does not by itself prove voice usage or submit an application.
