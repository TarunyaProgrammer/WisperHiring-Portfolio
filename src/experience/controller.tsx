import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { chapters } from "../data/portfolio";
import { createCameraTimeline, initialCameraPose, type CameraPose } from "./cameraRoute";
gsap.registerPlugin(ScrollTrigger);
type Controller = {
  cameraPose: { current: CameraPose };
  active: number;
  reduced: boolean;
  reading: boolean;
  setReading: (value: boolean) => void;
  go: (index: number) => void;
};
const Context = createContext<Controller | null>(null);
export function ExperienceProvider({ children }: { children: ReactNode }) {
  const cameraPose = useRef<CameraPose>({ ...initialCameraPose }),
    [active, setActive] = useState(0),
    [reduced, setReduced] = useState(
      () => matchMedia("(prefers-reduced-motion: reduce)").matches,
    ),
    [reading, setReading] = useState(false);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReduced(media.matches);
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);
  useEffect(() => {
    const ctx = gsap.context(() => {
      const journey = document.querySelector<HTMLElement>(".journey");
      if (journey) {
        const cameraTimeline = createCameraTimeline(cameraPose.current);
        ScrollTrigger.create({
          animation: cameraTimeline,
          trigger: journey,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.65,
          invalidateOnRefresh: true,
          onRefresh: (self) => {
            // A refresh/reflow keeps the playhead on the actual scroll position.
            cameraTimeline.progress(self.progress);
          },
        });
      }
      chapters.forEach((chapter, i) => {
        ScrollTrigger.create({
          trigger: `#${chapter.id}`,
          start: "top 50%",
          end: "bottom 50%",
          onToggle: (self) => {
            if (self.isActive) setActive(i);
          },
        });
      });
    });
    return () => ctx.revert();
  }, [reading]);
  const go = (index: number) => {
    document
      .getElementById(chapters[index].id)
      ?.scrollIntoView({
        behavior: reduced ? "instant" : "smooth",
        block: "start",
      });
  };
  return (
    <Context value={{ cameraPose, active, reduced, reading, setReading, go }}>
      {children}
    </Context>
  );
}
export function useExperience() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("ExperienceProvider required");
  return ctx;
}
