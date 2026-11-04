import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { ArrowDown, ArrowUpRight, BookOpen, RotateCcw } from "lucide-react";
import {
  achievements,
  campaignStages,
  chapters,
  metrics,
  profile,
  projects,
  skillGroups,
} from "./data/portfolio";
import { ExperienceProvider, useExperience } from "./experience/controller";
import { ExperienceErrorBoundary } from "./interface/ExperienceErrorBoundary";
import "./experience/dream.css";

const WorldCanvas = lazy(() =>
  import("./experience/WorldCanvas").then((module) => ({ default: module.MemoizedWorldCanvas })),
);

function Portfolio() {
  const { active, go, reading, setReading, updateProgress } = useExperience();
  const [track, setTrack] = useState<HTMLElement | null>(null);
  const [stage, setStage] = useState(0);
  const replay = useCallback(() => go(0), [go]);

  useEffect(() => {
    if (!reading || !track) return;
    const sections = Array.from(track.querySelectorAll<HTMLElement>(".dream-beat"));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const index = sections.indexOf(visible.target as HTMLElement);
        if (index >= 0) updateProgress(chapters[index].progress);
      },
      { threshold: [0.55, 0.7] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [reading, track, updateProgress]);

  const compactProjects = projects.slice(0, 4);
  return (
    <div className={`dream-experience${reading ? " is-reading" : ""}`}>
      <a className="dream-skip" href="#overview">Skip to story</a>
      {!reading && (
        <ExperienceErrorBoundary
          fallback={
            <div className="dream-scene-fallback" role="status">
              The 3D passage could not load. Continue through the story below.
            </div>
          }
        >
          <Suspense fallback={<div className="dream-loading" role="status">Preparing the passage…</div>}>
            <WorldCanvas track={track} />
          </Suspense>
        </ExperienceErrorBoundary>
      )}

      <header className="dream-chrome" aria-label="Dream controls">
        <button
          className="dream-reading-toggle"
          type="button"
          aria-pressed={reading}
          onClick={() => setReading(!reading)}
        >
          <BookOpen size={15} aria-hidden="true" />
          <span>{reading ? "Return to the world" : "Reading mode"}</span>
        </button>
      </header>

      <main className="dream-track" ref={setTrack}>
        <section className="dream-beat dream-beat--intro" id="overview" aria-labelledby="dream-title">
          <div className="dream-copy">
            <p className="dream-kicker"><span>00</span> / THE THRESHOLD</p>
            <h1 id="dream-title">Hi, I’m<br /><em>Tarunya Kesharwani.</em></h1>
            <p className="dream-lede">Scroll to explore the ideas, systems, and people that shape what I build.</p>
            <button className="dream-scroll-cue" type="button" onClick={() => go(1)}>
              <ArrowDown size={15} aria-hidden="true" />
              <span>Begin the journey</span>
            </button>
          </div>
        </section>

        <section className="dream-beat dream-beat--right" id="origin" aria-labelledby="origin-title">
          <div className="dream-copy">
            <p className="dream-kicker"><span>01</span> / ORIGIN</p>
            <h2 id="origin-title">Curiosity was the first tool.</h2>
            <p>{chapters[1].description}</p>
            <dl className="dream-facts">
              <div><dt>STUDYING</dt><dd>{profile.education}</dd></div>
              <div><dt>AT</dt><dd>{profile.school}</dd></div>
              <div><dt>BASED IN</dt><dd>India · open to global collaboration</dd></div>
            </dl>
            <a className="dream-inline-link" href={profile.github} target="_blank" rel="noreferrer">
              Follow the work on GitHub <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>
        </section>

        <section className="dream-beat" id="workshop" aria-labelledby="workshop-title">
          <div className="dream-copy dream-copy--wide">
            <p className="dream-kicker"><span>02</span> / THE WORKSHOP</p>
            <h2 id="workshop-title">Ideas become useful when they work.</h2>
            <p>{chapters[2].description}</p>
            <div className="dream-project-list">
              {compactProjects.map((project, index) => (
                <article className="dream-project" key={project.id}>
                  <span className="dream-project-index">0{index + 1}</span>
                  <div>
                    <h3>{project.name}</h3>
                    <p>{project.summary}</p>
                    <small>{project.stack.join(" · ")}</small>
                  </div>
                  <a href={project.url} target="_blank" rel="noreferrer" aria-label={`Open ${project.name} repository`}>
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="dream-beat dream-beat--right" id="skills" aria-labelledby="skills-title">
          <div className="dream-copy dream-copy--wide">
            <p className="dream-kicker"><span>03</span> / THE CONSTELLATION</p>
            <h2 id="skills-title">Different tools.<br /><em>Connected systems.</em></h2>
            <p>{chapters[3].description}</p>
            <div className="dream-skill-groups">
              {skillGroups.map((group) => (
                <div className="dream-skill-group" key={group.name}>
                  <h3>{group.name}</h3>
                  <ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="dream-beat" id="proof" aria-labelledby="proof-title">
          <div className="dream-copy dream-copy--wide">
            <p className="dream-kicker"><span>04</span> / THE PROOF</p>
            <h2 id="proof-title">Work speaks louder than credentials.</h2>
            <p>{chapters[4].description}</p>
            <div className="dream-proof-list">
              {achievements.map((item) => (
                <article key={item.title}>
                  <p className="dream-proof-label">{item.label}</p>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <a className="dream-inline-link" href={item.url} target="_blank" rel="noreferrer">
                    {item.link} <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="dream-beat dream-beat--right" id="signal" aria-labelledby="signal-title">
          <div className="dream-copy dream-copy--wide">
            <p className="dream-kicker"><span>05</span> / SIGNAL LAB</p>
            <h2 id="signal-title">What if an idea began as a voice note?</h2>
            <p>{chapters[5].description}</p>
            <div className="dream-campaign">
              <div className="dream-campaign-tabs" role="group" aria-label="Build out loud proposal stages">
                {campaignStages.map((campaignStage, index) => (
                  <button
                    key={campaignStage.name}
                    type="button"
                    aria-pressed={stage === index}
                    onClick={() => setStage(index)}
                  >
                    <span>0{index + 1}</span>{campaignStage.name}
                  </button>
                ))}
              </div>
              <section className="dream-campaign-panel" id="dream-stage-panel" aria-label={`${campaignStages[stage].name} stage`}>
                <p className="dream-proof-label">{campaignStages[stage].label}</p>
                <h3>{campaignStages[stage].title}</h3>
                <p>{campaignStages[stage].body}</p>
              </section>
              <div className="dream-measurement" aria-label="Proposed measurement journey">
                {metrics.map((metric, index) => <span key={metric}>{index > 0 && <i aria-hidden="true" />}{metric}</span>)}
              </div>
              <p className="dream-proposal-note">A proposed experiment. No campaign results are claimed.</p>
            </div>
          </div>
        </section>

        <section className="dream-beat dream-beat--ending" id="horizon" aria-labelledby="horizon-title">
          <div className="dream-copy dream-copy--ending">
            <p className="dream-kicker"><span>06</span> / THE HORIZON</p>
            <h2 id="horizon-title">Every world<br />needs its next chapter.</h2>
            <p>{chapters[6].description}</p>
            <a className="dream-contact-link" href={`mailto:${profile.email}`}>
              Let’s build something <ArrowUpRight size={16} aria-hidden="true" />
            </a>
            <nav className="dream-socials" aria-label="More about Tarunya">
              <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
              <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
              <a href={profile.resume} target="_blank" rel="noreferrer">Résumé</a>
            </nav>
            <button className="dream-replay" type="button" onClick={replay}>
              <RotateCcw size={15} aria-hidden="true" />
              <span>Replay from the beginning</span>
            </button>
          </div>
        </section>
      </main>

      <nav className="dream-progress" aria-label="Story chapters">
        {chapters.map((chapter, index) => (
          <button
            key={chapter.id}
            type="button"
            aria-label={`Scroll to ${chapter.name}`}
            aria-current={active === index ? "step" : undefined}
            onClick={() => go(index)}
          >
            <span />
          </button>
        ))}
      </nav>
      <p className="dream-sr-only" aria-live="polite">{chapters[active].name}</p>
    </div>
  );
}

export default function DreamExperience() {
  return (
    <ExperienceProvider>
      <Portfolio />
    </ExperienceProvider>
  );
}
