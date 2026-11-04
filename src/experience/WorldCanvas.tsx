import { Component, memo, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { MutableRefObject, ReactNode } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { ACESFilmicToneMapping } from "three";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import { useExperience } from "./controller";
import { World } from "./World";
import { chapters } from "../data/portfolio";
gsap.registerPlugin(ScrollTrigger);

class SceneBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error) {
    console.error("The Dream world failed to render.", error);
    this.props.onError();
  }
  render() { return this.state.failed ? null : this.props.children; }
}

function ScrollProgress({
  track,
  invalidate,
}: {
  track: HTMLElement | null;
  invalidate: MutableRefObject<(() => void) | null>;
}) {
  const { progress, updateProgress, reduced } = useExperience();
  const invalidateFrame = useThree((state) => state.invalidate);

  useEffect(() => {
    invalidate.current = invalidateFrame;
    return () => { invalidate.current = null; };
  }, [invalidate, invalidateFrame]);

  useLayoutEffect(() => {
    if (!track) return;
    const driver = { value: progress.current };
    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: track,
          start: "top top",
          end: "bottom bottom",
          scrub: reduced ? true : 0.85,
          invalidateOnRefresh: true,
          onRefresh: (self) => {
            driver.value = self.progress;
            updateProgress(driver.value);
            invalidate.current?.();
          },
        },
        onUpdate: () => {
          const value = reduced && chapters.length > 1
            ? Math.min(1, Math.round(driver.value * chapters.length) / chapters.length)
            : driver.value;
          updateProgress(value);
          invalidate.current?.();
        },
      });
      timeline.fromTo(driver, { value: progress.current }, { value: 1, duration: 1, ease: "none" });
      ScrollTrigger.refresh();
    }, track);
    return () => context.revert();
  }, [track, reduced, progress, updateProgress, invalidate]);

  return null;
}

export function WorldCanvas({ track }: { track: HTMLElement | null }) {
  const { reading, reduced } = useExperience();
  const [visible, setVisible] = useState(!document.hidden);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const invalidate = useRef<(() => void) | null>(null);

  useEffect(() => {
    const change = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", change);
    return () => document.removeEventListener("visibilitychange", change);
  }, []);

  useEffect(() => {
    const canvas = document.querySelector<HTMLCanvasElement>(".dream-world-canvas canvas");
    if (!canvas) return;
    const lost = (event: Event) => {
      event.preventDefault();
      setFailed(true);
    };
    const restored = () => setFailed(false);
    canvas.addEventListener("webglcontextlost", lost);
    canvas.addEventListener("webglcontextrestored", restored);
    return () => {
      canvas.removeEventListener("webglcontextlost", lost);
      canvas.removeEventListener("webglcontextrestored", restored);
    };
  }, [reading]);

  if (reading) return null;
  return (
    <div className="dream-world-canvas">
      {!failed ? (
        <SceneBoundary onError={() => setFailed(true)}>
          {!ready && <div className="dream-loading" role="status">Preparing the passage…</div>}
          <Canvas
            dpr={reduced ? [1, 1.1] : [1, 1.4]}
            frameloop={!visible ? "never" : reduced ? "demand" : "always"}
            camera={{ position: [0, 4.4, 25], fov: 44, near: 0.1, far: 360 }}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: "high-performance",
              toneMapping: ACESFilmicToneMapping,
            }}
            onCreated={({ gl }) => {
              setReady(true);
              gl.setClearColor("#100b17", 0);
              gl.domElement.setAttribute("aria-hidden", "true");
            }}
          >
            <fog attach="fog" args={["#171020", 34, 180]} />
            <ambientLight intensity={0.9} color="#c4b8dd" />
            <hemisphereLight args={["#c7b8ef", "#1d1425", 0.9]} />
            <directionalLight position={[9, 18, 16]} color="#fff0df" intensity={3.1} />
            <pointLight position={[0, 10, 8]} color="#ae8cff" intensity={170} distance={62} decay={2} />
            <pointLight position={[-8, 5, -24]} color="#825aff" intensity={48} distance={42} />
            <pointLight position={[10, 6, -104]} color="#fb9ecf" intensity={54} distance={50} />
            <pointLight position={[0, 8, -176]} color="#8ed9ff" intensity={68} distance={56} />
            <ScrollProgress track={track} invalidate={invalidate} />
            <World />
          </Canvas>
        </SceneBoundary>
      ) : (
        <div className="dream-scene-fallback" role="status">
          <span>The 3D world is unavailable. Continue with the story below.</span>
        </div>
      )}
    </div>
  );
}

export const MemoizedWorldCanvas = memo(WorldCanvas);
