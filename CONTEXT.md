# Current project context

Last updated: 2026-11-04 (Asia/Kolkata).

## Objective
Build a new cinematic, scroll-driven 3D portfolio for Tarunya Kesharwani for the Wispr Flow challenge. Preserve separate scene/content/controller layers. Current workspace began as an empty Git repository.

## In progress
Foundation and dependencies prepared. Implementing a procedural miniature island with four districts, authored camera waypoints, HTML storytelling, project dialogs and an interactive growth proposal. No deployment yet.

## Decisions
- React 19 / R3F 9, Three.js, Drei, GSAP ScrollTrigger, Vite, TypeScript, Tailwind v4.
- One normal page scroll, one persistent Canvas, mutable continuous progress, discrete React UI state.
- Warm ivory / forest / orange, Instrument Serif and Inter (explicit brief choices), original procedural architecture, no third-party 3D assets.
- Supplied existing portfolio is content provenance only; this is a fresh experience.
- User supplied contact and GSoC details. Avoid unverified counts and claimed 60% API reduction until supporting evidence exists.

## Required next checks
Production build, desktop/mobile browser QA, modal/navigation/campaign controls, reduced-motion and reading mode. Public deployment and submission deliverables remain outstanding.

## Milestone 2
- First implementation pushed to origin/main at b0b6fc5.
- User explicitly requested ongoing GitHub pushes, a persistent goal, token efficiency, fast execution, and separate Normal/Dream architectures.
- `App.tsx` selects separate `NormalPortfolio.tsx` and lazy `DreamExperience.tsx`. Normal imports no scene/controller. Reading mode remains a Dream accessibility feature, not the Normal experience.
- Reference images favor rocky islands, atmospheric water, warm windows and vertical architecture. Dream now has dusk lighting, ocean, distant landforms and shoreline rocks. It is procedural stylization, not reference-level asset fidelity.
- Parallel audit fixed upward terrain extrusion burying paths, mobile navigation accessible names, initial scroll progress, and disconnected focus restoration.
- Reduced-motion holds camera static. Native dialog provides focus trapping and Escape.
- npm install succeeded (0 reported vulnerabilities); initial production build passed. Rebuilding after mode split and font subset correction.
- Local Vite server at http://127.0.0.1:5173/ responds HTTP 200 from approved executor.
- Browser QA UNVERIFIED: browser tab API returns timeoutMs infrastructure error; native capture failed; full native Chrome reading rejected by auto-review due unrelated private tabs. Do not bypass this restriction.
- Site registered once: appgprj_6aeafcbd9f208191ae2e99047ef9a8dd, expected URL https://the-world-of-tarunya.subtlemoss2.chatgpt.site. Manifest persisted. No deployed version yet.
- Public access attempt rejected by automatic approval review: requires explicit authorization for this specific Site. Keep private until permission granted. Prepare reviewable private deployment first.

## Verification update
- Build after Normal/Dream separation passed. Default Vite splitting fixed an accidental dependency merge: Normal now does NOT preload Three.js (verified from dist HTML). Normal entry ~76 KB gzip; Dream controller ~49 KB gzip; lazy world ~245 KB gzip. Bundle warning remains for world chunk.
- `scripts/verify.mjs` passes SSR checks for Normal, project links/data, navigation IDs, campaign stages/metrics, finite camera waypoints/FOV, 3D lazy boundary and production assets. This is NOT browser interaction QA.
- Social PNG and favicon exist. Canonical and OG origin point at registered expected Site; update if deployment destination changes.
- Automatic approval review also rejected escalated Sites source sync: destination-specific upload authorization required. Asked user explicit authorization through async question. Do not retry until answer. GitHub pushes remain authorized.

## Latest checked state
Production build and `npm run verify` passed after formatting and atmospheric update. Committed milestone 2 at 90c7c3d. Initial push failed with GitHub internal server error; retry in progress. Core implementation is present, but browser interaction/visual checks and public hosting are not completed, so do not claim a verified percentage or submission readiness.

Normal bundle: 76.46 KB gzip; Dream: 49.04 KB gzip; lazy World: 245.37 KB gzip. These are build output sizes, not performance benchmark scores. `npm run verify` must follow a current production build.

Resolved: milestone 90c7c3d successfully pushed to origin/main after retry. Handoff documentation committed at 68aa641; final context note is being pushed with it. Hosting permission remains pending. Implementation goal remains active; no public deployment or browser QA success is claimed.

## World art direction update
World.tsx now uses a stronger irregular island contour, an exposed low-poly cliff band, stepped central plaza, a curved canal with pale banks, flat paved paths, two canal causeways, grouped shoreline rocks and five nearby wooded islets. Tree crowns are varied by instance and kept clear of landmark footprints. The three-bay Workshop now has pitched copper gables, timber facade divisions and warm windows; the Proof tower has a tapered lighthouse profile; Signal has a beacon. WorldCanvas uses a physical dusk sky and warm hemisphere/sun lighting. Existing procedural distant mountain ring remains. No browser screenshot QA was possible.

Verified after this scene pass: `npm run build` and `npm run verify` pass. Remaining known limitations: world chunk ~248.5 KB gzip warning; no visual/browser QA. GitHub docs pushes intermittently return server errors; user authorized milestone pushes.

## Camera choreography update (in progress)
One GSAP timeline now animates camera position, look target, and FOV from 0 to 1. Twenty authored poses stage overview, district approach/orbit, elevated cross-island turns, and the final reveal. Sine easing gives each aerial move gentle acceleration/deceleration. ScrollTrigger uses scrub 0.65; refresh resyncs the timeline to current scroll, and native reverse scroll retraces the same timeline. CameraRig directly applies the pose without a second smoothing layer. Verification tests strict route progress, framing bounds and repeatable reverse scrubbing. Production/browser motion remains unverified because browser automation is unavailable.
