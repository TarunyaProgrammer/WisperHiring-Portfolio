import { CatmullRomCurve3, Vector3 } from "three";

// One closed, gently banked route makes the ending return to the opening
// threshold. The arch field and set pieces are authored against this spline.
const routePoints = [
  [0, 1.35, 19],
  [-3, 1.8, -8],
  [-13, 2.6, -39],
  [-16, 3.4, -72],
  [-2, 4.2, -100],
  [15, 6.5, -128],
  [12, 7.5, -155],
  [-9, 4.8, -179],
  [-25, 2.5, -158],
  [-23, 1.9, -119],
  [-9, 1.5, -74],
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
