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
import MobileNav from "../components/MobileNav";
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

const librarySteps = [
  {
    title: "Choose the subject shelf",
    copy: "Open Guided Lessons for FAR, AUD, REG, BAR, ISC, TCP, or general professional judgment. Start with the subject shown in your Cockpit recommendation.",
  },
  {
    title: "Read the lesson in small passes",
    copy: "Do not try to memorize the whole library at once. Read one concept, identify the rule, and notice the exam trap before moving on.",
  },
  {
    title: "Use Deep Dive when a topic feels blurry",
    copy: "Deep Dive expands the lesson into why it matters, how the rule works, and how it appears in simulations or real CPA work.",
  },
  {
    title: "Send weak terms to Recall Lab",
    copy: "After each lesson, review the key vocabulary with active recall: predict the meaning, reveal the answer, take the check, and grade confidence.",
  },
] as const;

const appSteps = [
  "Enter your name so the app can personalize the dashboard and study flow.",
  "Open the Cockpit to see your recommended next action, accuracy, XP, readiness, and weekly target.",
  "Go to Guided Lessons and complete one focused lesson before practicing.",
  "Use Recall Lab for ten reinforcement reps so definitions become usable memory.",
  "Drill questions in Question Drill, then review every miss for the exact concept that broke.",
  "Try Simulation Lab when you can explain the concept without looking at notes.",
  "Use Case Judgment and War Room to practice evidence, risk, ethics, and recommendation language.",
  "Check Illinois License progress so exam study and licensure steps stay connected.",
] as const;

const bestPractices = [
  {
    title: "Study in loops, not marathons",
    copy: "One strong loop is lesson, recall, questions, simulation, feedback. Repeat that loop instead of rereading passively for hours.",
  },
  {
    title: "Write before revealing",
    copy: "In Recall Lab and Simulation Lab, predict the answer first. Memory gets stronger when your brain has to retrieve before it reviews.",
  },
  {
    title: "Treat wrong answers as a map",
    copy: "A miss is useful data. Tag whether the problem was vocabulary, rule, calculation, evidence, or exam trap.",
  },
  {
    title: "End every session with a next action",
    copy: "Before closing the app, choose tomorrow's first task. That keeps the next study session from starting with decision fatigue.",
  },
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
          <a href="#learning-library">Learning Library</a>
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

      <section className="landing-section" id="learning-library" aria-labelledby="library-title">
        <div className="landing-section-heading">
          <p className="landing-subbrand">Learning Library</p>
          <h2 id="library-title">Use the library like a guided CPA bookshelf.</h2>
          <p>
            The Learning Library is where you build understanding before testing yourself. It connects Guided Lessons,
            Deep Dive, Recall Lab, AI Coach, simulations, and real case judgment into one learning path.
          </p>
        </div>

        <div className="landing-guide-grid">
          {librarySteps.map((step, index) => (
            <article key={step.title} className="landing-guide-card">
              <span>{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section landing-quickstart" aria-labelledby="how-title">
        <div className="landing-section-heading">
          <p className="landing-subbrand">How to use this app step by step</p>
          <h2 id="how-title">Follow one visible study loop every time.</h2>
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

      <section className="landing-section landing-quickstart" aria-labelledby="steps-title">
        <div className="landing-section-heading">
          <p className="landing-subbrand">Step-by-step routine</p>
          <h2 id="steps-title">A complete session from opening the app to closing it.</h2>
        </div>
        <ol className="landing-steps-list">
          {appSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="landing-section landing-quickstart" aria-labelledby="best-title">
        <div className="landing-section-heading">
          <p className="landing-subbrand">Get the most out of it</p>
          <h2 id="best-title">Use the app as a coach, not a storage folder.</h2>
          <p>
            The goal is not to click every page. The goal is to create a repeatable study rhythm that turns weak areas
            into exam-ready judgment.
          </p>
        </div>
        <div className="landing-guide-grid">
          {bestPractices.map((practice) => (
            <article key={practice.title} className="landing-guide-card">
              <h3>{practice.title}</h3>
              <p>{practice.copy}</p>
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
      <MobileNav />
    </main>
  );
}
