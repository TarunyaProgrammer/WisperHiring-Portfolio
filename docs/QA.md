# Verification record

2026-11-04, current milestone: separate Normal and Dream modes.

## Passed
- The procedural island world compiles with sculpted shoreline variation, layered mesa, defined coastal rocks and islets, a winding river, two causeways, and flat paved routes.
- Four landmarks now share stone, dark timber and copper roof materials while keeping distinct silhouettes.
- TypeScript strict compilation and Vite production build.
- Normal server rendering; all four project titles and real repository URLs.
- Normal navigation targets and campaign stage/measurement data.
- Build and verify pass for 20 timestamped camera poses. Waypoint timing is strictly increasing from scroll 0 to 1, altitude stays 8-24, and FOV ranges 36-47.
- GSAP timeline test samples a point, moves forward, scrubs backward, and confirms the exact same pose on return.
- Production assets and social image exist.
- Default HTML does not preload the 3D bundle.
- Local preview HTTP 200 from approved execution context.
- Code audit: terrain cap corrected; mobile chapter names explicit; native modal focus restoration guarded; ScrollTrigger refresh synchronizes progress.

## Implemented, requires browser verification
- Camera choreography and world composition.
- Scroll navigation and landmark picking.
- Native dialogs: focus trapping, Escape, dismissal and restoration.
- Campaign tabs: mouse, arrows, Home/End.
- Mobile layout and touch targets.
- Mode switches, browser history, reduced motion, WebGL fallback.
- Browser console and actual frame performance.

## External blockers / incomplete
- Browser tab automation fails before navigation. Native window inspection was rejected due unrelated private tabs. Do not bypass.
- Hosting source upload/public access requires user's destination-specific approval after auto-review rejection.
- Voice evidence, application video, role/availability and grant choice remain applicant tasks.

Do not convert implementation presence into a measured completion percentage or claim performance scores.
