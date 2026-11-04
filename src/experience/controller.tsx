import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { chapters } from "../data/portfolio";
import { initialCameraPose, type CameraPose } from "./cameraRoute";

type TravelCommand = { district: number; sequence: number };
type Controller = {
  active: number;
  cameraPose: { current: CameraPose };
  reading: boolean;
  reduced: boolean;
  setReading: (value: boolean) => void;
  travel: TravelCommand;
  go: (index: number) => void;
};
type SceneController = Pick<Controller, "cameraPose" | "travel" | "go">;
type ExperienceMode = Pick<Controller, "reading" | "setReading">;

const Context = createContext<Controller | null>(null);
const SceneContext = createContext<SceneController | null>(null);
const ModeContext = createContext<ExperienceMode | null>(null);
const MotionContext = createContext<boolean | null>(null);

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const cameraPose = useRef<CameraPose>({ ...initialCameraPose });
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [reading, setReading] = useState(false);
  const [travel, setTravel] = useState<TravelCommand>({ district: 0, sequence: 0 });
  const travelSequence = useRef(0);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReduced(media.matches);
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);

  const go = useCallback((index: number) => {
    const district = Math.max(0, Math.min(chapters.length - 1, index));
    setActive(district);
    setTravel({ district, sequence: ++travelSequence.current });
  }, []);

  const scene = useMemo(() => ({ cameraPose, travel, go }), [go, travel]);
  const mode = useMemo(() => ({ reading, setReading }), [reading]);
  const experience = useMemo(
    () => ({ active, cameraPose, reading, reduced, setReading, travel, go }),
    [active, go, reading, reduced, travel],
  );

  return (
    <Context value={experience}>
      <SceneContext value={scene}>
        <ModeContext value={mode}>
          <MotionContext value={reduced}>{children}</MotionContext>
        </ModeContext>
      </SceneContext>
    </Context>
  );
}

export function useExperience() {
  const context = useContext(Context);
  if (!context) throw new Error("ExperienceProvider required");
  return context;
}

export function useSceneController() {
  const context = useContext(SceneContext);
  if (!context) throw new Error("ExperienceProvider required");
  return context;
}

export function useExperienceMode() {
  const context = useContext(ModeContext);
  if (!context) throw new Error("ExperienceProvider required");
  return context;
}

export function useReducedMotion() {
  const reduced = useContext(MotionContext);
  if (reduced === null) throw new Error("ExperienceProvider required");
  return reduced;
}
