import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { NormalPortfolio } from "./NormalPortfolio";
import { ExperienceErrorBoundary } from "./interface/ExperienceErrorBoundary";
import { setAmbientMusicEnabled } from "./experience/ambientMusic";

const DreamExperience = lazy(() => import("./DreamExperience"));

export function App() {
  const [mode, setMode] = useState<"normal" | "dream">(() =>
    new URLSearchParams(location.search).get("mode") === "dream" ? "dream" : "normal",
  );
  const [entered, setEntered] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(
    () => localStorage.getItem("tarunya-sound") !== "off",
  );
  const wakeScroll = useRef(0);

  const switchMode = useCallback((next: "normal" | "dream") => {
    if (mode === next) return;
    if (mode === "normal") wakeScroll.current = window.scrollY;
    const url = new URL(location.href);
    url.searchParams.set("mode", next);
    url.hash = "";
    history.pushState({ mode: next, wakeScroll: wakeScroll.current }, "", url);
    setMode(next);
    if (next === "dream") window.scrollTo(0, 0);
    else requestAnimationFrame(() => window.scrollTo({ top: wakeScroll.current, behavior: "auto" }));
  }, [mode]);

  useEffect(() => {
    const pop = () => {
      const next = new URLSearchParams(location.search).get("mode") === "dream" ? "dream" : "normal";
      setMode(next);
      if (next === "normal") requestAnimationFrame(() => window.scrollTo({ top: wakeScroll.current, behavior: "auto" }));
    };
    window.addEventListener("popstate", pop);
    return () => window.removeEventListener("popstate", pop);
  }, []);

  const enter = useCallback(() => {
    setEntered(true);
    if (soundEnabled) setAmbientMusicEnabled(true);
  }, [soundEnabled]);

  useEffect(() => {
    if (entered) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Enter" && !event.repeat) {
        event.preventDefault();
        enter();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [entered, enter]);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    localStorage.setItem("tarunya-sound", next ? "on" : "off");
    if (entered) setAmbientMusicEnabled(next);
  };

  if (!entered) {
    return (
      <main className="entry-gate" aria-label="The World of Tarunya">
        <div className="entry-gate-main">
          <button className="entry-enter" type="button" onClick={enter} autoFocus>
            [ ENTER ]
          </button>
          <button
            className="entry-sound-toggle"
            type="button"
            aria-pressed={soundEnabled}
            aria-label={`Sound ${soundEnabled ? "on" : "off"}. Toggle sound before entering.`}
            onClick={toggleSound}
          >
            {soundEnabled ? <Volume2 size={15} aria-hidden="true" /> : <VolumeX size={15} aria-hidden="true" />}
            <span>SOUND {soundEnabled ? "ON" : "OFF"}</span>
          </button>
        </div>
      </main>
    );
  }

  if (mode === "normal") {
    return (
      <NormalPortfolio
        onDream={() => switchMode("dream")}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
      />
    );
  }

  return (
    <div className="dream-app-shell">
      <div className="app-dream-controls" aria-label="Experience controls">
        <button type="button" onClick={() => switchMode("normal")} aria-label="Return to Wake mode">Wake</button>
        <button type="button" onClick={toggleSound} aria-pressed={soundEnabled} aria-label={`Sound ${soundEnabled ? "on" : "off"}`}>
          {soundEnabled ? <Volume2 size={16} aria-hidden="true" /> : <VolumeX size={16} aria-hidden="true" />}
          <span className="dream-sound-label">Sound {soundEnabled ? "on" : "off"}</span>
        </button>
      </div>
      <ExperienceErrorBoundary
        fallback={
          <main className="mode-failure" role="alert">
            <h1>The Dream experience couldn’t load.</h1>
            <p>Your portfolio is still available in Wake mode.</p>
            <button onClick={() => switchMode("normal")}>Return to Wake mode</button>
            <button onClick={() => window.location.reload()}>Reload the experience</button>
          </main>
        }
      >
        <Suspense fallback={<div className="mode-loading" role="status" aria-label="Opening the Dream"><span className="visually-hidden">Opening the Dream…</span></div>}>
          <DreamExperience />
        </Suspense>
      </ExperienceErrorBoundary>
    </div>
  );
}
