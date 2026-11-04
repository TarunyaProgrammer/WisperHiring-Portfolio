import { useState } from "react";
import { ArrowDown, ArrowUpRight, Moon } from "lucide-react";
import { profile, projects, achievements } from "./data/portfolio";
import { Campaign } from "./interface/Campaign";
export function NormalPortfolio({ onDream }: { onDream: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div className="normal-portfolio">
      <header className="normal-header">
        <a className="normal-name" href="#top">
          Tarunya Kesharwani<span>ENGINEER & BUILDER</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
        <button className="dream-switch" type="button" onClick={onDream}>
          <Moon size={14} aria-hidden="true" focusable="false" /> Enter the dream <ArrowUpRight size={15} aria-hidden="true" focusable="false" />
        </button>
      </header>
      <main>
        <section className="normal-hero" id="top">
          <p className="eyebrow">
            COMPUTER SCIENCE. OPEN SOURCE. A LITTLE CURIOSITY.
          </p>
          <h1>
            I build systems.
            <br />
            <em>And follow ideas.</em>
          </h1>
          <div className="normal-hero-bottom">
            <p>{profile.introduction}</p>
            <a className="text-link" href="#work">
              Explore selected work <ArrowDown size={16} aria-hidden="true" focusable="false" />
            </a>
          </div>
          <button
            className="dream-portal"
            type="button"
            onClick={onDream}
            aria-label="Enter Dream mode, an interactive 3D world"
          >
            <span className="portal-art" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
              <i />
            </span>
            <span>
              <small>THERE’S ANOTHER WAY TO MEET ME.</small>
              <strong>Step into my world.</strong>
              <span>
                Four districts. One interactive 3D journey.{" "}
                <ArrowUpRight size={17} aria-hidden="true" focusable="false" />
              </span>
            </span>
          </button>
        </section>
        <section className="normal-work normal-section" id="work">
          <div className="normal-section-title">
            <p className="eyebrow">01 / SELECTED WORK</p>
            <h2>
              Made to do
              <br />
              something useful.
            </h2>
          </div>
          <div className="normal-projects">
            {projects.map((p, i) => (
              <article
                className={
                  selected === p.id
                    ? "normal-project expanded"
                    : "normal-project"
                }
                key={p.id}
              >
                <button
                  className="normal-project-toggle"
                  type="button"
                  onClick={() => setSelected(selected === p.id ? null : p.id)}
                  aria-expanded={selected === p.id}
                  aria-controls={`normal-detail-${p.id}`}
                >
                  <span className="project-index">0{i + 1}</span>
                  <span>
                    <small className="eyebrow">{p.category}</small>
                    <h3>{p.name}</h3>
                    <p>{p.summary}</p>
                  </span>
                  <span className="project-expand">
                    {selected === p.id ? "−" : "+"}
                  </span>
                </button>
                <div
                  id={`normal-detail-${p.id}`}
                  hidden={selected !== p.id}
                  className="normal-project-detail"
                >
                  <h4>The problem</h4>
                  <p>{p.problem}</p>
                  <h4>The architecture</h4>
                  <p>{p.architecture}</p>
                  <div className="stack">
                    {p.stack.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                  <a
                    className="text-link"
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Explore repository <ArrowUpRight size={16} aria-hidden="true" focusable="false" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="normal-section normal-about" id="about">
          <div className="normal-section-title">
            <p className="eyebrow">02 / A PRACTICE OF BUILDING</p>
            <h2>
              Stay curious.
              <br />
              Show your work.
            </h2>
          </div>
          <div className="normal-about-content">
            <p className="normal-bio">
              I’m a second-year B.Tech student at Newton School of Technology. I
              care about the decisions behind a product: what runs locally, what
              belongs at the edge, and how the interface makes a complex system
              feel simple.
            </p>
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
                  <ArrowUpRight size={14} aria-hidden="true" focusable="false" />
                </a>
              </article>
            ))}
          </div>
        </section>
        <section className="normal-signal normal-section">
          <div className="normal-section-title">
            <p className="eyebrow">03 / AN IDEA FOR WISPR FLOW</p>
            <h2>
              Give good ideas
              <br />a voice.
            </h2>
            <p className="normal-signal-intro">
              A proposed campus creator experiment connecting voice, building in
              public, and measurable product habits.
            </p>
          </div>
          <Campaign />
        </section>
        <section className="normal-contact normal-section" id="contact">
          <p className="eyebrow">04 / WHAT COMES NEXT</p>
          <h2>
            Something worth
            <br />
            building together?
          </h2>
          <a className="normal-email" href={`mailto:${profile.email}`}>
            {profile.email}
            <ArrowUpRight size={24} aria-hidden="true" focusable="false" />
          </a>
          <div className="social-links">
            <a href={profile.github} target="_blank" rel="noreferrer">
              GitHub <ArrowUpRight size={14} aria-hidden="true" focusable="false" />
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              LinkedIn <ArrowUpRight size={14} aria-hidden="true" focusable="false" />
            </a>
            <a href={profile.resume} target="_blank" rel="noreferrer">
              Résumé <ArrowUpRight size={14} aria-hidden="true" focusable="false" />
            </a>
          </div>
        </section>
      </main>
      <footer className="normal-footer">
        <span>Tarunya Kesharwani © 2026</span>
        <button type="button" onClick={onDream}>
          Still curious? Enter the dream <ArrowUpRight size={14} aria-hidden="true" focusable="false" />
        </button>
        <a href="#top">Back to top ↑</a>
      </footer>
    </div>
  );
}
