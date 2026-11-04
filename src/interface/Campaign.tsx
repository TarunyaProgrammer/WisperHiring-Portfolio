import { useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { campaignStages, metrics } from "../data/portfolio";
import { DetailDialog } from "./DetailDialog";
export function Campaign({ expanded = false }: { expanded?: boolean }) {
  const [stage, setStage] = useState(0),
    [open, setOpen] = useState(expanded);
  const content = (
    <>
      <p className="eyebrow">A PROPOSAL FOR WISPR FLOW</p>
      <h2 className="campaign-title">Build out loud.</h2>
      <p className="campaign-line">Speak an idea. Build it. Show the world.</p>
      <div className="campaign-tabs" role="tablist" aria-label="Campaign plan">
        {campaignStages.map((s, i) => (
          <button
            id={`campaign-tab-${i}`}
            aria-controls="campaign-panel"
            tabIndex={stage === i ? 0 : -1}
            onKeyDown={(e) => {
              if (["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) {
                e.preventDefault();
                const next =
                  e.key === "Home"
                    ? 0
                    : e.key === "End"
                      ? 3
                      : (stage + (e.key === "ArrowRight" ? 1 : 3)) % 4;
                setStage(next);
                document.getElementById(`campaign-tab-${next}`)?.focus();
              }
            }}
            role="tab"
            aria-selected={stage === i}
            className={stage === i ? "selected" : ""}
            onClick={() => setStage(i)}
            key={s.name}
          >
            <span>0{i + 1}</span>
            {s.name}
          </button>
        ))}
      </div>
      <section
        id="campaign-panel"
        role="tabpanel"
        aria-labelledby={`campaign-tab-${stage}`}
        className="campaign-panel"
        key={stage}
      >
        <p className="eyebrow">{campaignStages[stage].label}</p>
        <h3>{campaignStages[stage].title}</h3>
        <p>{campaignStages[stage].body}</p>
        <div className="experiment-output">
          <span className="eyebrow">WHAT WE LEARN / MAKE</span>
          <p>{campaignStages[stage].output}</p>
        </div>
      </section>
      <div className="measurement">
        <p className="eyebrow">MEASURE THE WHOLE JOURNEY</p>
        <div>
          {metrics.map((m, i) => (
            <span key={m}>
              {m}
              {i < metrics.length - 1 && <ArrowRight size={12} />}
            </span>
          ))}
        </div>
      </div>
      <p className="proposal-note">
        Proposed experiment. No campaign has been run and no results are
        claimed. Activation criteria and instrumentation would be agreed with
        the Flow team before launch.
      </p>
    </>
  );
  return (
    <>
      <button className="campaign-invitation" onClick={() => setOpen(true)}>
        <div className="waveform" aria-hidden="true">
          {Array.from({ length: 25 }, (_, i) => (
            <i
              key={i}
              style={{ height: `${10 + Math.abs(Math.sin(i * 1.9)) * 30}px` }}
            />
          ))}
        </div>
        <span className="eyebrow">THE CAMPUS CREATOR EXPERIMENT</span>
        <strong>Build out loud.</strong>
        <span>
          Explore the campaign <ArrowUpRight size={18} />
        </span>
      </button>
      {open && (
        <DetailDialog
          onClose={() => setOpen(false)}
          title="Build out loud campaign proposal"
        >
          {content}
        </DetailDialog>
      )}
    </>
  );
}
