# Production readiness notes

Last reviewed: 2026-11-04

## Checks completed

- `npm run build` passes TypeScript and creates a production Vite build. Wake ships separately from the Dream/WebGL chunks; Dream dependencies are loaded on demand.
- `npm run verify` passes server-rendered Wake checks, profile/project URL checks, story chapter ordering, closed route geometry, scroll-timeline wiring, and production asset checks.
- `git diff --check` passes.
- Impeccable source scan: no critical failures. It reports advisory font-family warnings for the bundled Inter/Instrument Serif pairing and one layout-transition warning in Dream CSS.
- Headless Chrome on the local production preview reached the black Enter gate, opened Wake and Dream, advanced to a later chapter using navigation, and returned to the first chapter by reversing scroll. No page errors appeared. At a 390px mobile viewport, Dream had no horizontal overflow.

## Known limits

- No public deployment was created or inspected. The user explicitly asked to keep the project local and on GitHub.
- Dream layers a generated atmospheric corridor plate with transparent live 3D arches, desktop skyline landmarks, particles, a parallax camera route, and scroll-synchronized story. It is not a physics simulation or free-flight environment.
- Headless checks do not establish frame rate or sound quality on physical devices. Verify graphics, audio, and touch scroll on a lower-powered phone before claiming full production readiness.
- Family content about the applicant's father is omitted until the applicant supplies the details.

## Remaining production work

- Verify graphics, audio, and touch scroll on a physical mobile device.
- Confirm graphics and audio behavior on a lower-powered device and a browser without WebGL.
- Recheck all profile and project claims against applicant-owned source links before public release.
- Run a remote link check and inspect the actual public deployment only after the user authorizes a deployment destination.
