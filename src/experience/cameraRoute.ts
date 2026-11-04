import { CatmullRomCurve3, Vector3 } from "three";

// One closed, gently banked route makes the ending return to the opening
// threshold. The arch field and set pieces are authored against this spline.
const routePoints = [
  [0, 1.35, 19],
  [0, 1.55, 2],
  [-7, 2.1, -18],
  [-17, 3.6, -38],
  [-13, 4.4, -57],
  [1, 2.2, -73],
  [18, 1.8, -91],
  [22, 5, -112],
  [11, 7.5, -130],
  [-7, 5.5, -146],
  [-22, 3.2, -166],
  [-21, 2.3, -185],
  [-7, 3.5, -197],
  [12, 5.8, -188],
  [25, 8.5, -168],
  [30, 11, -145],
  [21, 10, -123],
  [3, 6.2, -111],
  [-14, 3.8, -98],
  [-28, 2.4, -79],
  [-31, 2.2, -56],
  [-23, 2, -34],
  [-10, 1.5, -15],
  [0, 1.35, 19],
].map(([x, y, z]) => new Vector3(x, y, z));

export const journeyCurve = new CatmullRomCurve3(
  routePoints.slice(0, -1),
  true,
  "catmullrom",
  0.12,
);
journeyCurve.curveType = "centripetal";
journeyCurve.arcLengthDivisions = 1200;
journeyCurve.updateArcLengths();

export const sampleCount = 320;

export function sampleJourneyRoute(
  progress: number,
  position: Vector3,
  tangent: Vector3,
) {
  const t = Math.min(1, Math.max(0, progress));
  journeyCurve.getPointAt(t, position);
  journeyCurve.getTangentAt(t, tangent).normalize();
}

export function routePointAt(progress: number, target = new Vector3()) {
  return journeyCurve.getPointAt(Math.min(1, Math.max(0, progress)), target);
}
