import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { chapters } from "../data/portfolio";

type Experience = {
  active: number;
  progress: { current: number };
  reading: boolean;
  reduced: boolean;
  setReading: (value: boolean) => void;
  updateProgress: (value: number) => void;
  go: (index: number) => void;
};

const Context = createContext<Experience | null>(null);

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const progress = useRef(0);
  const [active, setActive] = useState(0);
  const [reading, setReading] = useState(false);
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReduced(media.matches);
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);

  const updateProgress = useCallback((value: number) => {
    const next = Math.min(1, Math.max(0, value));
    progress.current = next;
    let chapter = 0;
    for (let i = 1; i < chapters.length; i++) {
      // ScrollTrigger progress can trail an integer scroll position by a few
      // thousandths, especially at evenly spaced chapter anchors.
      if (next + 0.002 >= chapters[i].progress) chapter = i;
      else break;
    }
    setActive((current) => (current === chapter ? current : chapter));
  }, []);

  const go = useCallback((index: number) => {
    const chapter = chapters[Math.max(0, Math.min(chapters.length - 1, index))];
    if (reading) {
      document.getElementById(chapter.id)?.scrollIntoView({
        behavior: reduced ? "instant" : "smooth",
        block: "start",
      });
      return;
    }
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    window.scrollTo({
      top: chapter.progress * maxScroll,
      behavior: reduced ? "instant" : "smooth",
    });
  }, [reading, reduced]);

  const value = useMemo(
    () => ({ active, progress, reading, reduced, setReading, updateProgress, go }),
    [active, reading, reduced, updateProgress, go],
  );

  return <Context value={value}>{children}</Context>;
}

export function useExperience() {
  const context = useContext(Context);
  if (!context) throw new Error("ExperienceProvider required");
  return context;
}
