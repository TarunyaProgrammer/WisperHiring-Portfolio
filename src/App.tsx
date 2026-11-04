import { lazy, Suspense, useEffect, useState } from "react";
import { NormalPortfolio } from "./NormalPortfolio";
const DreamExperience = lazy(() => import("./DreamExperience"));
export function App() {
  const [mode, setMode] = useState<"normal" | "dream">(() =>
    new URLSearchParams(location.search).get("mode") === "dream"
      ? "dream"
      : "normal",
  );
  const switchMode = (next: "normal" | "dream") => {
    const url = new URL(location.href);
    url.searchParams.set("mode", next);
    url.hash = "";
    history.pushState({}, "", url);
    window.scrollTo(0, 0);
    setMode(next);
  };
  useEffect(() => {
    const pop = () => {
      setMode(
        new URLSearchParams(location.search).get("mode") === "dream"
          ? "dream"
          : "normal",
      );
    };
    window.addEventListener("popstate", pop);
    return () => window.removeEventListener("popstate", pop);
  }, []);
  return mode === "normal" ? (
    <NormalPortfolio onDream={() => switchMode("dream")} />
  ) : (
    <Suspense
      fallback={
        <div className="mode-loading" role="status">
          Opening the dream…
        </div>
      }
    >
      <DreamExperience onExit={() => switchMode("normal")} />
    </Suspense>
  );
}
