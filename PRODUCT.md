# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary audience: Wispr Flow's hiring team reviewing a candidate for its India growth challenge. Secondary audience: developers and collaborators who want to inspect Tarunya's work.

## Product Purpose

Present Tarunya Kesharwani's engineering work, open-source experience, and product-growth thinking through a portfolio that is both readable and memorable. Success means visitors can understand her capabilities quickly, inspect real project evidence, and reach her.

## Positioning

The portfolio separates an editorial Wake experience from a guided Dream story world. Real projects and career evidence remain accessible as HTML while the Dream scene connects them through an authored, scroll-driven 3D narrative.

## Operating Context

This is a web portfolio for a hiring challenge. Visitors may use desktop or mobile browsers, keyboard, touch, and assistive technology. User authorized local development and GitHub pushes, and explicitly said to keep the work local and on GitHub; do not publish or upload it to Sites.

## Capabilities and Constraints

- Normal/Wake and Dream are distinct experiences with a persistent way to switch between them.
- Dream is intended to begin with an explicit user gesture, then use page scroll to drive a third-person camera and synchronized story beats. Free camera zoom/orbit is not part of the desired Dream interaction.
- The applicant supplied `bgmusic.mp3` and reports a Pixabay source. Ambient music is optional and starts only from the Enter gesture; provide a persistent sound control and keyboard/touch activation. Track title/creator data was not supplied.
- Keep project, profile, and achievement text available as accessible HTML.
- Existing stack: React 19, TypeScript, Vite, Three.js/R3F, Drei, GSAP, Tailwind CSS. Normal should not load 3D dependencies unnecessarily.
- Do not invent personal details, metrics, endorsements, project outcomes, or campaign results. Family-story content about Tarunya's father is undecided until supplied.
- Keep current profile spelling as Tarunya Kesharwani unless the user confirms otherwise.

## Brand Commitments

Product name: The World of Tarunya. The user rejected green for the portfolio and approved an editorial, mouse-reactive Wake design plus a cinematic Dream journey inspired by, but not copying, daikifujita.com. No external music or artwork may be copied from that reference.

## Evidence on Hand

- Supplied profile, contact links, project repositories, education, GSoC/C2SI and open-source details are documented in `docs/CONTENT-SOURCES.md`.
- Exact repository URLs and available project descriptions live in `src/data/portfolio.ts`.
- Achievement counts and several performance claims are intentionally omitted until supported. Family details are not supplied; do not invent a father chapter. Use only the applicant-supplied soundtrack asset.

## Product Principles

- Make technical work easy to inspect and verify.
- Let the experience express the candidate's curiosity and ownership.
- Connect storytelling to real work, not unsupported claims.
- Keep the portfolio usable without 3D or sound.
- Preserve visitor control over sound and accessible reading.
