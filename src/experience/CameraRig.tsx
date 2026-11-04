import { useFrame, useThree } from "@react-three/fiber";
import { MathUtils, PerspectiveCamera, Vector3 } from "three";
import { useMemo } from "react";
import { useExperience } from "./controller";
// Positions and targets are authored together. The content layer owns no Three objects.
export const cameraKeyframes = [
  { position: [24, 23, 30], target: [0, 0, 0], fov: 36 },
  { position: [12, 12, 20], target: [-4, 1, 4], fov: 38 },
  { position: [16, 11, 10], target: [5, 1, 3], fov: 40 },
  { position: [-4, 14, 10], target: [-5, 2, -4], fov: 38 },
  { position: [13, 12, 3], target: [5, 2, -5], fov: 39 },
  { position: [22, 18, 25], target: [0, 1, 0], fov: 36 },
];
export function CameraRig() {
  const { progress, reduced } = useExperience(),
    { camera, size } = useThree();
  const target = useMemo(() => new Vector3(), []),
    position = useMemo(() => new Vector3(), []),
    look = useMemo(() => new Vector3(), []),
    nextPosition = useMemo(() => new Vector3(), []),
    nextTarget = useMemo(() => new Vector3(), []);
  useFrame((_, delta) => {
    const scaled =
        MathUtils.clamp(reduced ? 0 : progress.current, 0, 1) *
        (cameraKeyframes.length - 1),
      index = Math.min(Math.floor(scaled), cameraKeyframes.length - 2);
    const a = cameraKeyframes[index],
      b = cameraKeyframes[index + 1],
      t = MathUtils.smoothstep(scaled - index, 0, 1);
    position.fromArray(a.position).lerp(nextPosition.fromArray(b.position), t);
    target.fromArray(a.target).lerp(nextTarget.fromArray(b.target), t);
    if (size.width < 650) position.multiplyScalar(1.25);
    const ease = reduced ? 1 : 1 - Math.exp(-5 * Math.min(delta, 0.1));
    camera.position.lerp(position, ease);
    look.lerp(target, ease);
    camera.lookAt(look);
    const cam = camera as PerspectiveCamera;
    cam.fov = MathUtils.lerp(a.fov, b.fov, t);
    cam.updateProjectionMatrix();
  });
  return null;
}
