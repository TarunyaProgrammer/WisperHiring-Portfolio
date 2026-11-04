import { Component, memo, Suspense, useEffect, useRef, useState } from "react";
import type { MutableRefObject, ReactNode } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Sky } from "@react-three/drei";
import { PerspectiveCamera } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useExperience, useExperienceMode, useReducedMotion } from "./controller";
import { createDistrictFlightTimeline, districtCameraPoses } from "./cameraRoute";
import { World } from "./World";
class SceneBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error) {
    console.error("The 3D world failed to render.", error);
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
function CameraTravel({
  controls,
}: {
  controls: MutableRefObject<OrbitControlsImpl | null>;
}) {
  const { cameraPose, travel } = useExperience();
  const reduced = useReducedMotion();
  const camera = useThree((state) => state.camera);

  useEffect(() => {
    if (travel.sequence === 0) return;
    const controlsInstance = controls.current;
    const pose = districtCameraPoses[travel.district];
    if (!controlsInstance || !pose) return;

    const perspective = camera as PerspectiveCamera;
    if (reduced) {
      camera.position.set(pose.x, pose.y, pose.z);
      controlsInstance.target.set(pose.lookX, pose.lookY, pose.lookZ);
      perspective.fov = pose.fov;
      perspective.updateProjectionMatrix();
      controlsInstance.update();
      Object.assign(cameraPose.current, pose);
      return;
    }

    controlsInstance.enabled = false;
    const timeline = createDistrictFlightTimeline(
      camera.position,
      controlsInstance.target,
      perspective,
      pose,
      () => controlsInstance.update(),
      () => {
        controlsInstance.enabled = true;
        Object.assign(cameraPose.current, pose);
      },
    );
    timeline.play();
    const visibility = () => {
      if (document.hidden) timeline.pause();
      else timeline.resume();
    };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      document.removeEventListener("visibilitychange", visibility);
      timeline.kill();
      controlsInstance.enabled = true;
    };
  }, [camera, cameraPose, controls, reduced, travel]);

  return null;
}
export function WorldCanvas({
  onProject,
  onProof,
  onProfile,
  onCampaign,
}: {
  onProject: (id: string) => void;
  onProof: () => void;
  onProfile: () => void;
  onCampaign: () => void;
}) {
  const { reading, setReading } = useExperienceMode(),
    reduced = useReducedMotion(),
    [visible, setVisible] = useState(!document.hidden),
    [ready, setReady] = useState(false),
    [sceneFailed, setSceneFailed] = useState(false),
    [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const controls = useRef<OrbitControlsImpl | null>(null);
  useEffect(() => {
    const change = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", change);
    return () => document.removeEventListener("visibilitychange", change);
  }, []);
  useEffect(() => {
    if (!canvas) return;
    const lost = (event: Event) => {
      event.preventDefault();
      setSceneFailed(true);
    };
    const restored = () => setSceneFailed(false);
    canvas.addEventListener("webglcontextlost", lost);
    canvas.addEventListener("webglcontextrestored", restored);
    return () => {
      canvas.removeEventListener("webglcontextlost", lost);
      canvas.removeEventListener("webglcontextrestored", restored);
    };
  }, [canvas]);
  if (reading) return null;
  return (
    <div
      className="world-canvas"
      role="group"
      aria-label="Interactive world. Use the keyboard, mouse, or touch controls to explore. Focus a landmark to hear its action."
    >
      {!ready && !sceneFailed && (
        <div className="scene-loading" role="status" aria-label="Preparing the world">
          <span className="loading-indicator" aria-hidden="true" />
          <span className="visually-hidden">Preparing your world…</span>
        </div>
      )}
      <SceneBoundary onError={() => setSceneFailed(true)}>
        <Canvas
          shadows
          dpr={[1, 1.5]}
          camera={{ position: [24, 23, 30], fov: 36, near: 0.1, far: 180 }}
          frameloop={!visible ? "never" : reduced ? "demand" : "always"}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          fallback={
            <button
              className="canvas-fallback"
              onClick={() => setReading(true)}
              type="button"
            >
              3D is unavailable. Open reading mode.
            </button>
          }
          onCreated={({ gl }) => {
            setReady(true);
            setCanvas(gl.domElement);
          }}
        >
          <Sky distance={450000} sunPosition={[-24, 9, -18]} turbidity={8} rayleigh={1.8} mieCoefficient={0.005} mieDirectionalG={0.82} />
          <fog attach="fog" args={["#596f6d", 40, 105]} />
          <ambientLight intensity={0.6} />
          <hemisphereLight args={["#ffe1b1", "#536f6c", 1.6]} />
          <directionalLight
            position={[-10, 24, 12]}
            color="#ffd19b"
            intensity={3.5}
            castShadow
            shadow-mapSize={reduced ? 512 : 1024}
            shadow-camera-left={-18}
            shadow-camera-right={18}
            shadow-camera-top={18}
            shadow-camera-bottom={-18}
            shadow-bias={-0.001}
          />
          <Suspense fallback={null}>
            <World
              onProject={onProject}
              onProof={onProof}
              onProfile={onProfile}
              onCampaign={onCampaign}
            />
            <CameraTravel controls={controls} />
            <OrbitControls
              ref={controls}
              makeDefault
              enableDamping={!reduced}
              dampingFactor={0.08}
              enablePan
              enableRotate
              enableZoom
              keyEvents
              minDistance={8}
              maxDistance={48}
              minPolarAngle={0.15}
              maxPolarAngle={Math.PI / 2.05}
            />
          </Suspense>
        </Canvas>
      </SceneBoundary>
      {sceneFailed && (
        <div className="scene-failure" role="alert">
          <p>The 3D scene stopped. Continue with the text version of the story.</p>
          <button type="button" onClick={() => setReading(true)}>
            Continue in reading mode
          </button>
          <button type="button" onClick={() => window.location.reload()}>
            Reload the 3D scene
          </button>
        </div>
      )}
    </div>
  );
}
export const MemoizedWorldCanvas = memo(WorldCanvas);
