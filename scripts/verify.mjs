import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { createServer } from "vite";
import { renderToString } from "react-dom/server";
import { createElement } from "react";
const server = await createServer({
  server: { middlewareMode: true, hmr: false },
  appType: "custom",
});
try {
  const data = await server.ssrLoadModule("/src/data/portfolio.ts");
  const { NormalPortfolio } = await server.ssrLoadModule(
    "/src/NormalPortfolio.tsx",
  );
  const html = renderToString(createElement(NormalPortfolio, { onDream() {} }));
  assert(!html.includes("<canvas"), "Normal must not require Canvas");
  for (const project of data.projects) {
    assert(html.includes(project.name));
    assert.equal(new URL(project.url).hostname, "github.com");
    assert(project.stack.length >= 3);
  }
  for (const id of ["top", "work", "about", "contact"])
    assert(html.includes(`id="${id}"`));
  assert.equal(data.campaignStages.length, 4);
  assert.equal(data.metrics.at(-1), "7-day retention");
  assert.equal(new Set(data.chapters.map((c) => c.id)).size, 6);
  const { cameraKeyframes, createCameraTimeline, initialCameraPose } =
    await server.ssrLoadModule("/src/experience/cameraRoute.ts");
  assert(cameraKeyframes.length >= 16);
  assert.equal(cameraKeyframes[0].at, 0);
  assert.equal(cameraKeyframes.at(-1).at, 1);
  assert(
    cameraKeyframes.every((frame, index) =>
      index === 0 || frame.at > cameraKeyframes[index - 1].at,
    ),
    "Camera route times must increase strictly",
  );
  for (const frame of cameraKeyframes) {
    for (const value of [
      frame.x, frame.y, frame.z,
      frame.lookX, frame.lookY, frame.lookZ, frame.fov,
    ]) assert(Number.isFinite(value));
    assert(frame.y >= 8 && frame.y <= 24);
    assert(frame.fov >= 36 && frame.fov <= 47);
  }
  const pose = { ...initialCameraPose };
  const cameraTimeline = createCameraTimeline(pose);
  assert(Math.abs(cameraTimeline.duration() - 1) < 1e-9);
  cameraTimeline.progress(0.405);
  const forward = { ...pose };
  cameraTimeline.progress(0.92);
  cameraTimeline.progress(0.405);
  assert.deepEqual(pose, forward, "Reverse scrubbing must retrace the same pose");
  cameraTimeline.kill();
  const index = readFileSync("dist/index.html", "utf8");
  assert(
    !index.includes("modulepreload"),
    "Normal entry must not preload the 3D bundle",
  );
  for (const path of index.matchAll(/(?:src|href)="(\/assets\/[^\"]+)"/g))
    assert(existsSync(`dist${path[1]}`));
  assert(existsSync("dist/og-image.png"));
  assert(existsSync("dist/favicon.svg"));
  const normalEntry = readdirSync("dist/assets").find(
    (f) => f.startsWith("index-") && f.endsWith(".js"),
  );
  assert(normalEntry);
  assert(
    !/from["']\.\/WorldCanvas/.test(
      readFileSync(`dist/assets/${normalEntry}`, "utf8"),
    ),
  );
  console.log(
    "PASS: Normal SSR, project content, navigation IDs, campaign data, reversible camera route, lazy 3D boundary, and production assets.",
  );
} finally {
  await server.close();
}
