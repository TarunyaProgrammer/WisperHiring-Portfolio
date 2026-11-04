# The World of Tarunya

A portfolio in two distinct experiences: **Wake**, an editorial portfolio, and **Dream**, a scroll-driven cinematic story through a bespoke 3D world. Built with React 19, TypeScript, Vite, React Three Fiber 9, Drei and GSAP.

## Run

```sh
npm install
npm run dev
npm run build
npm run verify
npm run preview
```

## Architecture

Wake and Dream are independent component trees. A first-visit `[ ENTER ]` gesture opens the selected mode and can start the optional supplied soundtrack. Wake keeps Dream entry visible in both the header and the persistent bottom switch. The default Wake experience does not preload Three.js. Browser Back/Forward restores the selected mode and Wake scroll position. Dream's camera and story share one reversible scroll timeline; the scene has no free zoom/orbit controls. A text reading mode provides the story without WebGL.

- `src/App.tsx`: mode selection and lazy Dream loading.
- `src/NormalPortfolio.tsx`: standalone editorial HTML portfolio.
- `src/DreamExperience.tsx`: immersive world controls, reading mode, and story panels.
- `src/data/portfolio.ts`: editable profile, projects, achievements, chapters and campaign.
- `src/experience/controller.tsx`: scroll progress, active story beat and reduced-motion/reading state.
- `src/experience/cameraRoute.ts`: authored camera poses along the Dream route.
- `src/experience/World.tsx`: procedural Dream environment and landmark silhouettes.
- `src/experience/WorldCanvas.tsx`: persistent WebGL scene and scroll-synchronized camera.
- `src/experience/ambientMusic.ts`: gesture-gated playback and persistent control for `public/audio/bgmusic.mp3`.
- `src/wake.css`: editorial Wake design system and responsive layouts.
- `src/interface`: accessible native dialogs and campaign tabs.
- `AGENTS.md` and `CONTEXT.md`: instructions and current handoff state.

Geometry is original, generated in code. No remote model downloads or API keys are required. Fonts are bundled locally. Reading mode works without the 3D layer. All key content and landmark actions are available in HTML.

Dream mode fills the viewport while the visitor scrolls through a continuous chase-camera route. Concise story panels stay synchronized with the camera and reverse cleanly with scroll. Reading mode provides the story without WebGL. Repeated environment details use shared geometry where appropriate, pixel ratio is capped, and rendering pauses in hidden tabs. No performance score is claimed.

The Wake sculpture and Dream landscape are generated image assets. The Dream plate depicts a winding water route, distinct pavilion and keep silhouettes, and the traveler; live Three.js contributes one authored threshold gate and restrained atmospheric particles. Scroll adds a static atmospheric landscape plate, while the camera and story follow one smooth, reversible route. The soundtrack was supplied by the applicant, who reports a Pixabay source; no track attribution data was included. GSoC and mentorship descriptions are applicant-supplied; volatile counts and unsubstantiated performance metrics are intentionally excluded. Personal details about the applicant's father are omitted until supplied by the applicant. See `docs/CONTENT-SOURCES.md`.

## Submission

See `docs/SUBMISSION.md` for the official requirements and applicant-owned remaining items. Building this site does not by itself prove voice usage or submit an application.
