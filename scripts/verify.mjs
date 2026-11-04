import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { createServer } from "vite";
import { renderToString } from "react-dom/server";
import { createElement } from "react";

const server = await createServer({
  server: { middlewareMode: true, hmr: false, ws: false },
  appType: "custom",
});

try {
  const data = await server.ssrLoadModule("/src/data/portfolio.ts");
  const { NormalPortfolio } = await server.ssrLoadModule(
    "/src/NormalPortfolio.tsx",
  );
  const html = renderToString(
    createElement(NormalPortfolio, {
      onDream() {},
      soundEnabled: false,
      onToggleSound() {},
    }),
  );

  assert(!html.includes("<canvas"), "Wake must not need a WebGL canvas");
  for (const id of ["wake-top", "wake-work", "wake-story", "wake-contact"])
    assert(html.includes(`id="${id}"`), `Missing Wake section ${id}`);
  for (const project of data.projects) {
    assert(html.includes(project.name));
    assert.equal(new URL(project.url).hostname, "github.com");
    assert(project.stack.length >= 3);
  }
  assert.equal(data.campaignStages.length, 4);
  assert.equal(data.metrics.at(-1), "7-day retention");
  assert.equal(data.chapters.length, 7);
  assert.equal(data.chapters[0].progress, 0);
  assert.equal(data.chapters.at(-1).progress, 1);
  assert(
    data.chapters.every((chapter, i) =>
      i === 0 || chapter.progress > data.chapters[i - 1].progress,
    ),
    "Story chapter progress must increase strictly",
  );

  const { journeyCurve, routePointAt } = await server.ssrLoadModule(
    "/src/experience/cameraRoute.ts",
  );
  const start = routePointAt(0);
  const middle = routePointAt(0.5);
  const end = routePointAt(1);
  assert(start.distanceTo(end) < 0.01, "Dream route must close at its opening");
  assert(middle.distanceTo(start) > 10, "Dream route must travel through the world");
  assert(journeyCurve.getLength() > 100, "Dream route must have cinematic scale");

  const canvasSource = readFileSync("src/experience/WorldCanvas.tsx", "utf8");
  assert(canvasSource.includes("ScrollTrigger"));
  assert(canvasSource.includes("scrub:"));
  assert(canvasSource.includes("gsap.timeline"));
  assert(!canvasSource.includes("OrbitControls"));
  assert(existsSync("public/images/wake-sculpture.png"));
  assert(existsSync("public/images/dream-environment.jpg"));

  const index = readFileSync("dist/index.html", "utf8");
  const normalEntry = readdirSync("dist/assets").find(
    (file) => file.startsWith("index-") && file.endsWith(".js"),
  );
  assert(normalEntry, "Built Wake entry chunk must exist");
  const normalBundle = readFileSync(`dist/assets/${normalEntry}`, "utf8");
  assert(!normalBundle.includes("WorldCanvas"), "Wake must lazy-load Dream");
  for (const path of index.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g))
    assert(existsSync(`dist${path[1]}`), `Missing built asset ${path[1]}`);
  assert(existsSync("dist/images/wake-sculpture.png"));
  assert(existsSync("dist/images/dream-environment.jpg"));
  assert(existsSync("dist/favicon.svg"));

  console.log(
    "PASS: Wake HTML and lazy boundary, supplied project links, story data, closed Dream route, scroll timeline, and production assets.",
  );
} finally {
  await server.close();
}
