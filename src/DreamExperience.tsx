import { lazy, Suspense, useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Map,
  MoveUpRight,
} from "lucide-react";
import { ExperienceProvider, useExperience } from "./experience/controller";
import { chapters, projects, profile, achievements } from "./data/portfolio";
import { DetailDialog } from "./interface/DetailDialog";
import { Campaign } from "./interface/Campaign";
const WorldCanvas = lazy(() =>
  import("./experience/WorldCanvas").then((m) => ({ default: m.WorldCanvas })),
);
function Portfolio({ onExit }: { onExit: () => void }) {
  const { active, go, reading, setReading, reduced } = useExperience(),
    [projectId, setProjectId] = useState<string | null>(null),
    [proof, setProof] = useState(false),
    [map, setMap] = useState(false);
  const project = projects.find((p) => p.id === projectId);
  useEffect(() => {
    const hash = location.hash.slice(1),
      i = chapters.findIndex((c) => c.id === hash);
    if (i >= 0) requestAnimationFrame(() => go(i));
  }, []); // Initial deep-link only; chapter navigation uses the same DOM scroll.
  return (
    <div className={reading ? "portfolio reading-mode" : "portfolio"}>
      <a className="skip-link" href="#origin">
        Skip to my story
      </a>
      <header className="site-header">
        <button
          className="wordmark"
          onClick={() => go(0)}
          aria-label="The World of Tarunya, back to top"
        >
          <span className="brand-mark">t.</span>
          <span>
            THE WORLD
            <br />
            OF TARUNYA
          </span>
        </button>
        <span className="header-note">YOU ARE IN THE DREAM.</span>
        <div className="header-actions">
          <button className="exit-dream" onClick={onExit}>
            Normal mode ↗
          </button>
          <button className="mode-button" onClick={() => setReading(!reading)}>
            <BookOpen size={15} />
            <span>{reading ? "Enter 3D world" : "Reading mode"}</span>
          </button>
          <a className="contact-link" href={`mailto:${profile.email}`}>
            Let’s talk <ArrowUpRight size={16} />
          </a>
        </div>
      </header>
      {!reading && (
        <Suspense
          fallback={<div className="scene-loading">Preparing your world…</div>}
        >
          <WorldCanvas
            onProject={setProjectId}
            onProof={() => setProof(true)}
          />
        </Suspense>
      )}
      <main className="journey">
        <section
          className="chapter hero"
          id="overview"
          aria-labelledby="hero-title"
        >
          <div className="chapter-copy">
            <p className="eyebrow hero-eyebrow">
              <span className="tiny-line" /> ENGINEER. BUILDER. EXPLORER.
            </p>
            <h1 id="hero-title">
              The world
              <br />
              of <em>Tarunya.</em>
            </h1>
            <p className="hero-tagline">
              Don’t just read my story.
              <br />
              Explore it.
            </p>
            <p className="hero-description">{chapters[0].description}</p>
            <button className="primary-button" onClick={() => go(1)}>
              Enter my world <ArrowUpRight size={19} />
            </button>
            <div className="hero-signature">
              <span>Tarunya Kesharwani</span>
              <span>Engineering ideas into reality.</span>
            </div>
          </div>
          <button className="scroll-invitation" onClick={() => go(1)}>
            <ArrowDown size={16} />
            <span>SCROLL TO EXPLORE</span>
          </button>
          <div className="hero-aside">
            <span>BUILT WITH CURIOSITY.</span>
            <span>Made to be explored.</span>
          </div>
        </section>
        <section className="chapter" id="origin" aria-labelledby="origin-title">
          <div className="chapter-copy">
            <p className="eyebrow">01 / ORIGIN</p>
            <h2 id="origin-title">{chapters[1].title}</h2>
            <p className="chapter-intro">{chapters[1].description}</p>
            <p className="body-copy">
              I’m interested in the space between a technically sound system and
              a product someone wants to use. Open source taught me to ask
              better questions. Independent building taught me to follow them
              through.
            </p>
            <div className="origin-note">
              <span className="eyebrow">CURRENTLY</span>
              <p>
                {profile.education}
                <br />
                <span>{profile.school}</span>
              </p>
            </div>
            <a
              className="text-link"
              href={profile.github}
              target="_blank"
              rel="noreferrer"
            >
              Meet me on GitHub <ArrowUpRight size={16} />
            </a>
          </div>
        </section>
        <section
          className="chapter"
          id="workshop"
          aria-labelledby="workshop-title"
        >
          <div className="chapter-copy">
            <p className="eyebrow">02 / THE WORKSHOP</p>
            <h2 id="workshop-title">{chapters[2].title}</h2>
            <p className="chapter-intro">{chapters[2].description}</p>
            <div className="project-list">
              {projects.map((p, i) => (
                <button key={p.id} onClick={() => setProjectId(p.id)}>
                  <span className="project-index">0{i + 1}</span>
                  <span>
                    <strong>{p.name}</strong>
                    <small>{p.category}</small>
                  </span>
                  <ArrowUpRight size={18} />
                </button>
              ))}
            </div>
            <p className="small-note">
              Choose a project, or click a building in the world.
            </p>
          </div>
        </section>
        <section className="chapter" id="proof" aria-labelledby="proof-title">
          <div className="chapter-copy">
            <p className="eyebrow">03 / THE PROOF</p>
            <h2 id="proof-title">{chapters[3].title}</h2>
            <p className="chapter-intro">{chapters[3].description}</p>
            <div className="proof-summary">
              <span className="proof-year">’26</span>
              <div>
                <span className="eyebrow">GOOGLE SUMMER OF CODE</span>
                <h3>C2SI · WebiU</h3>
                <p>
                  Event-driven backends.
                  <br />
                  Open-source collaboration.
                </p>
              </div>
            </div>
            <button className="text-link" onClick={() => setProof(true)}>
              Explore the work behind the story <ArrowUpRight size={17} />
            </button>
          </div>
        </section>
        <section
          className="chapter signal-chapter"
          id="signal"
          aria-labelledby="signal-title"
        >
          <div className="chapter-copy">
            <p className="eyebrow">04 / SIGNAL LAB</p>
            <h2 id="signal-title">{chapters[4].title}</h2>
            <p className="chapter-intro">{chapters[4].description}</p>
            <Campaign />
          </div>
        </section>
        <section
          className="chapter horizon"
          id="horizon"
          aria-labelledby="horizon-title"
        >
          <div className="chapter-copy">
            <p className="eyebrow">05 / THE HORIZON</p>
            <h2 id="horizon-title">{chapters[5].title}</h2>
            <p className="chapter-intro">{chapters[5].description}</p>
            <a className="primary-button" href={`mailto:${profile.email}`}>
              Let’s build something <ArrowUpRight size={19} />
            </a>
            <div className="social-links">
              <a href={profile.github} target="_blank" rel="noreferrer">
                GitHub <ArrowUpRight size={14} />
              </a>
              <a href={profile.linkedin} target="_blank" rel="noreferrer">
                LinkedIn <ArrowUpRight size={14} />
              </a>
              <a href={profile.resume} target="_blank" rel="noreferrer">
                Résumé <ArrowUpRight size={14} />
              </a>
            </div>
            <a className="email-link" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
            <p className="small-note">
              Based in India. Open to a conversation about what comes next.
            </p>
            <button className="text-link back-top" onClick={() => go(0)}>
              Back to the beginning <MoveUpRight size={16} />
            </button>
          </div>
        </section>
      </main>
      <footer className="journey-footer">
        <div className="current-location">
          <span className="location-mark" />
          <span>
            <small>YOU ARE EXPLORING</small>
            <strong>{chapters[active].name}</strong>
          </span>
        </div>
        <nav className="chapter-nav" aria-label="District navigation">
          {chapters.slice(1, 5).map((c, i) => (
            <button
              key={c.id}
              aria-label={`${c.name} district`}
              aria-current={active === i + 1 ? "step" : undefined}
              onClick={() => go(i + 1)}
            >
              <span>{c.number}</span>
              <span>{c.name}</span>
            </button>
          ))}
        </nav>
        <button className="map-button" onClick={() => setMap(true)}>
          <Map size={17} />
          <span>World map</span>
        </button>
      </footer>
      {map && (
        <DetailDialog
          title="World map and chapter navigation"
          onClose={() => setMap(false)}
        >
          <p className="eyebrow">YOUR OWN PATH THROUGH THE WORLD</p>
          <h2>Where to?</h2>
          <div className="map-list">
            {chapters.map((c, i) => (
              <button
                key={c.id}
                onClick={() => {
                  setMap(false);
                  go(i);
                }}
              >
                <span>{c.number}</span>
                <strong>{c.name}</strong>
                <ArrowRight size={18} />
              </button>
            ))}
          </div>
          <p className="small-note">
            All chapters are accessible by keyboard.{" "}
            {reduced
              ? "Reduced motion is enabled."
              : "Scroll at your own pace."}
          </p>
        </DetailDialog>
      )}
      {project && (
        <DetailDialog title={project.name} onClose={() => setProjectId(null)}>
          <p className="eyebrow">{project.category}</p>
          <h2>{project.name}</h2>
          <p className="dialog-intro">{project.summary}</p>
          <div
            className={`project-visual visual-${project.symbol}`}
            style={{ "--project-color": project.color } as React.CSSProperties}
          >
            <div className="architecture-diagram">
              <span>{project.stack[0]}</span>
              <ArrowRight />
              <span>{project.stack[1]}</span>
              <ArrowRight />
              <span>{project.stack[2]}</span>
            </div>
            <small>ARCHITECTURE STUDY / {project.name.toUpperCase()}</small>
          </div>
          <div className="detail-copy">
            <h3>The problem</h3>
            <p>{project.problem}</p>
            <h3>How it works</h3>
            <p>{project.architecture}</p>
            <div className="stack">
              {project.stack.map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>
            <h3>The engineering question</h3>
            <p>{project.learning}</p>
          </div>
          <a
            className="primary-button"
            href={project.url}
            target="_blank"
            rel="noreferrer"
          >
            Explore the repository <ArrowUpRight size={18} />
          </a>
        </DetailDialog>
      )}
      {proof && (
        <DetailDialog
          title="Open-source work and education"
          onClose={() => setProof(false)}
        >
          <p className="eyebrow">03 / THE PROOF</p>
          <h2>A practice of showing up.</h2>
          <div className="achievement-list">
            {achievements.map((a) => (
              <article key={a.title}>
                <p className="eyebrow">{a.label}</p>
                <h3>{a.title}</h3>
                <p>{a.description}</p>
                <a
                  className="text-link"
                  href={a.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {a.link}
                  <ArrowUpRight size={16} />
                </a>
              </article>
            ))}
          </div>
        </DetailDialog>
      )}
    </div>
  );
}
export default function DreamExperience({ onExit }: { onExit: () => void }) {
  return (
    <ExperienceProvider>
      <Portfolio onExit={onExit} />
    </ExperienceProvider>
  );
}
