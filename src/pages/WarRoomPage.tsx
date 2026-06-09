import { useMemo, useState } from "react";
import { AlertTriangle, Brain, CheckCircle2, ClipboardList, Scale, Target } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import LearningFlow from "../components/LearningFlow";
import StatCard from "../components/StatCard";
import simulations from "../data/simulations.json";
import featuredCases from "../data/featured-cases.json";
import { useAnalyticsStore } from "../store/analyticsStore";
import { useUserStore } from "../store/userStore";
import { calculateReadiness } from "../utils/readinessEngine";
import { getAccuracy, getCurrentSubject } from "../utils/learningFlow";
import type { CaseStudy } from "../types/caseStudy";

interface Simulation {
  id: string;
  subject: string;
  title: string;
  timeLimitMinutes: number;
  scenario: string;
  exhibits: string[];
  tasks: string[];
  rubric: string[];
  modelAnswer: string;
}

type WarScenario =
  | {
      id: string;
      type: "Simulation";
      subject: string;
      title: string;
      timeLimitMinutes: number;
      scenario: string;
      evidence: string[];
      tasks: string[];
      rubric: string[];
      modelAnswer: string;
      sourceLabel?: string;
    }
  | {
      id: string;
      type: "Case";
      subject: string;
      title: string;
      timeLimitMinutes: number;
      scenario: string;
      evidence: string[];
      tasks: string[];
      rubric: string[];
      modelAnswer: string;
      sourceLabel?: string;
    };

function scoreResponse(response: string, rubric: string[]) {
  const normalized = response.toLowerCase();
  const hits = rubric.filter((item) => normalized.includes(item.toLowerCase()));
  const score = Math.round((hits.length / Math.max(rubric.length, 1)) * 100);
  const missing = rubric.filter((item) => !hits.includes(item));
  return { score, hits, missing };
}

function getFeedback(score: number) {
  if (score >= 85) return "Strong professional judgment. You identified the core issue, used evidence, and connected the risk to a defensible recommendation.";
  if (score >= 65) return "Good judgment base. Add more specific evidence, consequences, and alternative treatments before calling it exam-ready.";
  if (score >= 40) return "Partial analysis. You saw part of the issue, but your answer needs clearer issue/rule/evidence/conclusion structure.";
  return "Rebuild the response. Start with the issue, list evidence, explain the risk, then recommend the next professional action.";
}

function makeWarScenarios(): WarScenario[] {
  const simulationScenarios = (simulations as Simulation[]).map((simulation) => ({
    id: simulation.id,
    type: "Simulation" as const,
    subject: simulation.subject,
    title: simulation.title,
    timeLimitMinutes: simulation.timeLimitMinutes,
    scenario: simulation.scenario,
    evidence: simulation.exhibits,
    tasks: simulation.tasks,
    rubric: simulation.rubric,
    modelAnswer: simulation.modelAnswer,
  }));

  const caseScenarios = (featuredCases as CaseStudy[]).map((study) => ({
    id: study.id,
    type: "Case" as const,
    subject: study.company,
    title: study.title,
    timeLimitMinutes: 25,
    scenario: `${study.summary} Root cause: ${study.rootCause || "Review the failure analysis and determine the professional response."}`,
    evidence: [
      ...(study.timeline || []).slice(0, 3).map((event) => `${event.year}: ${event.event}`),
      ...study.failureAnalysis.slice(0, 3),
    ],
    tasks: [
      "Identify the most important professional judgment issue.",
      "Explain which evidence is most persuasive.",
      "Describe the ethical or audit risk.",
      "Recommend what a CPA should do next.",
    ],
    rubric: [
      "evidence",
      "risk",
      "ethics",
      "control",
      "disclosure",
      "recommendation",
    ],
    modelAnswer: `A strong response identifies the core failure at ${study.company}, connects it to evidence rather than hindsight, explains the ethical or audit risk, and recommends a concrete professional response. The response should mention controls, disclosure, evidence quality, and how the CPA protects users or clients from being misled.`,
    sourceLabel: study.sources?.[0]?.label,
  }));

  return [...simulationScenarios, ...caseScenarios];
}

export default function WarRoomPage() {
  const analytics = useAnalyticsStore();
  const { profile, addXP } = useUserStore();
  const recommendedSubject = getCurrentSubject(profile, analytics);
  const [filter, setFilter] = useState("ALL");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [response, setResponse] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const scenarios = useMemo(() => makeWarScenarios(), []);
  const filtered = scenarios.filter((scenario) => filter === "ALL" || scenario.subject === filter || scenario.type === filter || scenario.subject === recommendedSubject);
  const selected = filtered.find((scenario) => scenario.id === selectedId) || filtered[0] || scenarios[0];
  const result = scoreResponse(response, selected.rubric);
  const accuracy = getAccuracy(analytics);
  const readiness = calculateReadiness({
    lessons: analytics.lessonsCompleted,
    totalLessons: 84,
    accuracy,
    cases: analytics.caseStudiesCompleted,
    vocab: analytics.vocabularyReviewed,
    mock: analytics.mockExamsCompleted,
  });
  const diagnosis =
    result.score >= 80
      ? "Ready for timed simulation work."
      : result.score >= 55
        ? "Close. Strengthen evidence and recommendation language."
        : "Needs deliberate critical-thinking reps before another full exam.";

  const submit = () => {
    setSubmitted(true);
    analytics.completeMockExam();
    analytics.setReadiness(Math.max(readiness, result.score));
    if (result.score >= 70) addXP(150);
  };

  return (
    <MainLayout>
      <div className="page-container space-y-6">
        <section className="page-heading">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-primary">Critical Thinking / War Room</p>
            <h1 className="section-title">War Room</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-200">
              Work real case and simulation scenarios. Make a judgment, defend it with evidence, and compare your answer to a rubric.
            </p>
          </div>
          <select value={filter} onChange={(event) => { setFilter(event.target.value); setSelectedId(null); setSubmitted(false); setResponse(""); }}>
            {["ALL", "Simulation", "Case", "FAR", "AUD", "REG", "BAR", "ISC", "TCP", "Enron", "WorldCom", "FTX", "Wirecard"].map((option) => <option key={option}>{option}</option>)}
          </select>
        </section>

        <LearningFlow />

        <section className="grid gap-4 md:grid-cols-4">
          <StatCard title="Readiness" value={`${readiness}%`} />
          <StatCard title="Accuracy" value={`${accuracy}%`} />
          <StatCard title="Judgment Score" value={submitted ? `${result.score}%` : "Pending"} />
          <StatCard title="Scenario Bank" value={scenarios.length} subtitle="real cases + sims" />
        </section>

        <section className="grid gap-4 xl:grid-cols-[360px_1fr]">
          <aside className="card h-fit xl:sticky xl:top-24">
            <div className="flex items-center gap-3">
              <span className="rounded-lg bg-emerald-50 p-2 text-primary"><ClipboardList size={18} /></span>
              <div>
                <h2 className="font-bold">Scenario Board</h2>
                <p className="text-sm text-slate-500">{filtered.length} critical-thinking scenarios</p>
              </div>
            </div>
            <div className="lesson-library mt-4">
              {filtered.map((scenario, index) => (
                <button
                  key={scenario.id}
                  onClick={() => {
                    setSelectedId(scenario.id);
                    setSubmitted(false);
                    setResponse("");
                  }}
                  className={`lesson-library-row ${selected.id === scenario.id ? "lesson-library-row-active" : ""}`}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span>
                    <b>{scenario.title}</b>
                    <small>{scenario.type} / {scenario.subject}</small>
                  </span>
                  {selected.id === scenario.id && <CheckCircle2 size={16} />}
                </button>
              ))}
            </div>
          </aside>

          <article className="exam-shell">
            <div className="exam-toolbar">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-primary">{selected.type} / {selected.subject} / {selected.timeLimitMinutes} min</p>
                <h2 className="mt-1 text-2xl font-bold">{selected.title}</h2>
              </div>
              <div className="rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-900">
                <b className="block">Current diagnosis</b>
                {submitted ? diagnosis : "Submit your judgment response to unlock feedback."}
              </div>
            </div>

            <section className="px-5 py-5">
              <h3 className="flex items-center gap-2 text-xl font-bold"><Brain size={20} /> Scenario</h3>
              <p className="mt-3">{selected.scenario}</p>
            </section>

            <section className="grid gap-4 px-5 md:grid-cols-2">
              <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                <h3 className="flex items-center gap-2 font-bold"><AlertTriangle size={18} /> Evidence</h3>
                <ul className="mt-3 list-disc space-y-2 pl-6">
                  {selected.evidence.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
              <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                <h3 className="flex items-center gap-2 font-bold"><Target size={18} /> Critical Thinking Tasks</h3>
                <ul className="mt-3 list-disc space-y-2 pl-6">
                  {selected.tasks.map((task) => <li key={task}>{task}</li>)}
                </ul>
              </div>
            </section>

            <section className="px-5 py-5">
              <label htmlFor="war-room-response">Your professional judgment response</label>
              <textarea
                id="war-room-response"
                className="mt-2 min-h-56 w-full"
                value={response}
                onChange={(event) => setResponse(event.target.value)}
                placeholder="Use this structure: Issue -> Evidence -> Risk -> Alternatives -> Recommendation."
              />
            </section>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-5 py-4 dark:border-slate-700">
              <p className="text-sm text-slate-500">
                {response.trim().length < 60 ? "Write at least 60 characters to score your judgment." : "Ready to score against the rubric."}
              </p>
              <button onClick={submit} disabled={response.trim().length < 60} className="rounded-lg bg-primary px-5 py-3 font-bold text-white">
                Score Critical Thinking
              </button>
            </div>

            {submitted && (
              <section className="feedback-panel m-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="flex items-center gap-2 text-2xl font-bold"><Scale size={22} /> Judgment Score: {result.score}%</h3>
                    <p className="mt-2">{getFeedback(result.score)}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-900">
                    <b>Rubric coverage</b>
                    <p>{result.hits.length}/{selected.rubric.length} criteria</p>
                  </div>
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <section>
                    <h4 className="font-bold">Covered</h4>
                    <ul className="mt-2 list-disc pl-6">
                      {result.hits.length ? result.hits.map((item) => <li key={item}>{item}</li>) : <li>No rubric terms detected yet.</li>}
                    </ul>
                  </section>
                  <section>
                    <h4 className="font-bold">Add Next Time</h4>
                    <ul className="mt-2 list-disc pl-6">
                      {result.missing.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </section>
                </div>
                <section className="mt-5 rounded-lg bg-slate-50 p-4 dark:bg-slate-900">
                  <h4 className="font-bold">Model Answer</h4>
                  <p className="mt-2">{selected.modelAnswer}</p>
                  {selected.sourceLabel && <p className="mt-3 text-sm"><b>Source basis:</b> {selected.sourceLabel}</p>}
                </section>
              </section>
            )}
          </article>
        </section>
      </div>
    </MainLayout>
  );
}
