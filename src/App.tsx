import { lazy, Suspense, useEffect, useState } from "react";
import { NormalPortfolio } from "./NormalPortfolio";
import { ExperienceErrorBoundary } from "./interface/ExperienceErrorBoundary";
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
    <ExperienceErrorBoundary
      fallback={
        <main className="mode-failure" role="alert">
          <h1>The Dream experience couldn’t load.</h1>
          <p>Your portfolio is still available in Normal mode.</p>
          <button onClick={() => switchMode("normal")}>
            Return to Normal mode
          </button>
          <button onClick={() => window.location.reload()}>
            Reload the experience
          </button>
        </main>
      }
    >
      <Suspense
        fallback={
          <div className="mode-loading" role="status" aria-label="Opening the dream">
            <span className="loading-indicator" aria-hidden="true" />
            <span className="visually-hidden">Opening the dream…</span>
          </div>
        }
      >
        <DreamExperience onExit={() => switchMode("normal")} />
      </Suspense>
    </ExperienceErrorBoundary>
  );
}
