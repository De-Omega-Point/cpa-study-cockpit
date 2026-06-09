import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  ClipboardCheck,
  Gauge,
  ListChecks,
  Radar,
  Route,
  ShieldCheck,
  Target,
} from "lucide-react";
import { useUserStore } from "../store/userStore";

const flowSteps = [
  {
    icon: Gauge,
    title: "Start in the Cockpit",
    copy: "See your next best action, XP, accuracy, readiness, and weekly study target in one place.",
  },
  {
    icon: BookOpen,
    title: "Learn in Small Loops",
    copy: "Use Guided Lessons and Deep Dive to learn one concept, one rule, and one exam trap at a time.",
  },
  {
    icon: BrainCircuit,
    title: "Ask the Local AI Coach",
    copy: "Search lessons, terms, and practice areas with local-first help before you drill questions.",
  },
  {
    icon: Target,
    title: "Practice and Test",
    copy: "Move into Question Drill, Practice Exam, and Simulation Lab when you are ready to apply the concept.",
  },
  {
    icon: ShieldCheck,
    title: "Pressure-Test Judgment",
    copy: "Use Case Judgment and War Room to explain evidence, risk, ethics, and recommendations.",
  },
] as const;

const cockpitReadouts = [
  ["Learn", "84 modules"],
  ["Practice", "200+ questions"],
  ["Simulate", "TBS feedback"],
  ["Judge", "real cases"],
] as const;

export default function LandingPage() {
  const { profile, updateProfile } = useUserStore();
  const [name, setName] = useState(profile.name);
  const navigate = useNavigate();

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) return;
    updateProfile({ name: cleanName });
    navigate("/dashboard");
  };

  return (
    <main className="landing-shell">
      <nav className="landing-nav" aria-label="Landing navigation">
        <Link to="/">CPA Study Cockpit</Link>
        <div>
          <Link to="/dashboard">Cockpit</Link>
          <Link to="/academy">Lessons</Link>
          <Link to="/vocabulary">Recall Lab</Link>
        </div>
      </nav>
      <section className="landing-hero" aria-labelledby="landing-title">
        <div className="cockpit-scene" aria-hidden="true">
          <div className="cockpit-grid" />
          <div className="cockpit-console">
            <div className="cockpit-radar">
              <Radar size={56} />
              <span />
            </div>
            <div className="cockpit-readouts">
              {cockpitReadouts.map(([label, value]) => (
                <div key={label}>
                  <b>{label}</b>
                  <span>{value}</span>
                </div>
              ))}
            </div>
            <div className="cockpit-route">
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>

        <div className="landing-copy">
          <p className="landing-subbrand">De-Omega-Point Project</p>
          <h1 id="landing-title">CPA Study Cockpit</h1>
          <p>
            A calmer command center for CPA learning: know what to study, practice the concept, test under pressure,
            and track readiness without hunting through the app.
          </p>

          <form className="landing-name-form" onSubmit={submit}>
            <label htmlFor="landing-name">Your name</label>
            <div>
              <input
                id="landing-name"
                autoComplete="given-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your name"
              />
              <button disabled={!name.trim()}>
                Enter Cockpit <ArrowRight size={18} />
              </button>
            </div>
          </form>

          <div className="landing-actions">
            <Link to="/dashboard">Open Dashboard</Link>
            <Link to="/academy">Browse Lessons</Link>
          </div>
        </div>
      </section>

      <section className="landing-section" aria-labelledby="how-title">
        <div className="landing-section-heading">
          <p className="landing-subbrand">How to use it</p>
          <h2 id="how-title">Follow one visible study loop.</h2>
          <p>
            CPA Study Cockpit is designed so every session has a clear beginning, middle, and finish.
            Start with direction, learn the concept, practice it, then use feedback to choose tomorrow's work.
          </p>
        </div>

        <div className="landing-flow-grid">
          {flowSteps.map(({ icon: Icon, title, copy }, index) => (
            <article key={title} className="landing-flow-card">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <Icon size={24} />
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section landing-quickstart" aria-labelledby="quickstart-title">
        <div>
          <p className="landing-subbrand">Recommended first session</p>
          <h2 id="quickstart-title">A 45-minute path that will not feel scattered.</h2>
        </div>
        <div className="landing-quickstart-grid">
          <Link to="/academy"><BookOpen size={22} /> Learn one lesson</Link>
          <Link to="/vocabulary"><ListChecks size={22} /> Review ten terms</Link>
          <Link to="/test-master"><Target size={22} /> Drill ten questions</Link>
          <Link to="/simulations"><ClipboardCheck size={22} /> Try one simulation</Link>
          <Link to="/tracker"><Route size={22} /> Check Illinois progress</Link>
        </div>
      </section>
    </main>
  );
}
