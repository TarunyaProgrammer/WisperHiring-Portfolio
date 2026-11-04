import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Volume2,
  VolumeX,
} from "lucide-react";
import { profile, projects, achievements } from "./data/portfolio";
import { Campaign } from "./interface/Campaign";
import "./wake.css";

type Props = {
  onDream: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
};

export function NormalPortfolio({ onDream, soundEnabled, onToggleSound }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const sculpture = useRef<HTMLDivElement>(null);
  const [openProject, setOpenProject] = useState<string | null>(null);

  useEffect(() => {
    const scope = root.current;
    if (!scope || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const items = scope.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.12, rootMargin: "0px 0px -5% 0px" },
    );
    items.forEach((item) => {
      item.classList.add("will-reveal");
      observer.observe(item);
    });
    return () => observer.disconnect();
  }, []);

  const followPointer = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    document.documentElement.style.setProperty("--wake-x", `${event.clientX}px`);
    document.documentElement.style.setProperty("--wake-y", `${event.clientY}px`);
    if (sculpture.current) {
      sculpture.current.style.transform = `translate3d(${x * 26}px, ${y * 20}px, 0) rotateX(${-y * 7}deg) rotateY(${x * 9}deg) rotateZ(${x * 3}deg)`;
    }
  };

  return (
    <div ref={root} className="wake-page" onPointerMove={followPointer}>
      <a className="wake-skip" href="#wake-work">Skip to selected work</a>
      <div className="wake-pointer-light" aria-hidden="true" />
      <header className="wake-header">
        <a className="wake-wordmark" href="#wake-top" aria-label="Tarunya Kesharwani, home">
          TARUNYA KESHARWANI
        </a>
        <nav aria-label="Main navigation">
          <a href="#wake-work">Work</a>
          <a href="#wake-story">About</a>
          <a href="#wake-contact">Contact</a>
        </nav>
        <button
          className="wake-sound"
          type="button"
          aria-pressed={soundEnabled}
          onClick={onToggleSound}
        >
          {soundEnabled ? <Volume2 size={16} aria-hidden="true" /> : <VolumeX size={16} aria-hidden="true" />}
          <span>Sound {soundEnabled ? "on" : "off"}</span>
        </button>
      </header>

      <main>
        <section id="wake-top" className="wake-hero" aria-labelledby="wake-title">
          <div className="wake-grid" aria-hidden="true" />
          <div className="wake-orbit-caption" aria-hidden="true">
            <span>ENGINEERING</span><i /> <span>IDEAS IN MOTION</span>
          </div>
          <div ref={sculpture} className="wake-sculpture" aria-hidden="true">
            <img src="/images/wake-sculpture.png" alt="" fetchPriority="high" />
          </div>
          <div className="wake-hero-copy">
            <h1 id="wake-title">
              I turn ideas<br />
              into <em>working systems.</em>
            </h1>
            <p className="wake-intro">{profile.introduction}</p>
            <a className="wake-text-link" href="#wake-work">
              Explore selected work <ArrowDownRight size={18} aria-hidden="true" />
            </a>
          </div>
          <div className="wake-hero-meta">
            <p>{profile.education}<br />{profile.school}</p>
            <span>BASED IN INDIA</span>
          </div>
          <div className="wake-scroll-note" aria-hidden="true">SCROLL TO EXPLORE <span>↓</span></div>
        </section>

        <section id="wake-work" className="wake-work wake-section">
          <div className="wake-section-heading" data-reveal>
            <h2>Built to solve<br />something real.</h2>
            <p>Products and systems shaped by a question, then tested against the messy details of use.</p>
          </div>
          <div className="wake-project-list">
            {projects.map((project, index) => {
              const expanded = openProject === project.id;
              return (
                <article className={`wake-project ${expanded ? "is-open" : ""}`} key={project.id} data-reveal>
                  <button
                    className="wake-project-head"
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={`wake-project-${project.id}`}
                    onClick={() => setOpenProject(expanded ? null : project.id)}
                  >
                    <span className="wake-project-number">0{index + 1}</span>
                    <span className="wake-project-name">
                      <small>{project.category}</small>
                      <strong>{project.name}</strong>
                    </span>
                    <span className="wake-project-summary">{project.summary}</span>
                    <ArrowUpRight size={21} aria-hidden="true" />
                  </button>
                  {expanded && (
                    <div className="wake-project-detail" id={`wake-project-${project.id}`}>
                      <div>
                        <h3>The problem</h3>
                        <p>{project.problem}</p>
                      </div>
                      <div>
                        <h3>How it works</h3>
                        <p>{project.architecture}</p>
                      </div>
                      <div>
                        <h3>What I learned</h3>
                        <p>{project.learning}</p>
                      </div>
                      <div className="wake-project-stack" aria-label="Technologies">
                        {project.stack.map((item) => <span key={item}>{item}</span>)}
                      </div>
                      <a className="wake-text-link" href={project.url} target="_blank" rel="noreferrer">
                        Open repository <ArrowUpRight size={16} aria-hidden="true" />
                      </a>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        <section id="wake-story" className="wake-story wake-section">
          <div className="wake-story-title" data-reveal>
            <h2>Learn in public.<br /><em>Build with intent.</em></h2>
          </div>
          <div className="wake-story-copy" data-reveal>
            <p className="wake-story-lede">I care about the decisions behind a product: what runs locally, what belongs at the edge, and how an interface makes a complex system feel simple.</p>
            <div className="wake-proof-list">
              {achievements.map((item) => (
                <article key={item.title}>
                  <span>{item.label}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <a href={item.url} target="_blank" rel="noreferrer">{item.link}<ArrowUpRight size={14} aria-hidden="true" /></a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="wake-signal" className="wake-signal wake-section">
          <div className="wake-signal-heading" data-reveal>
            <h2>Let ideas<br />find their <em>voice.</em></h2>
            <p>A small creator experiment: turn a spoken idea into a working prototype, share the process, and measure what happens next.</p>
          </div>
          <div className="wake-campaign" data-reveal><Campaign /></div>
        </section>

        <section id="wake-contact" className="wake-contact wake-section">
          <div data-reveal>
            <h2>Have something<br />worth building?</h2>
          </div>
          <div className="wake-contact-links" data-reveal>
            <a className="wake-email" href={`mailto:${profile.email}`}>{profile.email}<ArrowUpRight size={20} aria-hidden="true" /></a>
            <div className="wake-socials">
              <a href={profile.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} aria-hidden="true" /></a>
              <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={14} aria-hidden="true" /></a>
              <a href={profile.resume} target="_blank" rel="noreferrer">Résumé <ArrowUpRight size={14} aria-hidden="true" /></a>
            </div>
          </div>
        </section>
      </main>

      <footer className="wake-footer">
        <span>Tarunya Kesharwani · 2026</span>
        <a href="#wake-top">Back to top ↑</a>
      </footer>

      <div className="wake-mode-switch" role="group" aria-label="Experience mode">
        <span aria-current="page">Wake</span>
        <button type="button" onClick={onDream} aria-label="Enter Dream mode">
          Dream <ArrowUpRight size={15} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
