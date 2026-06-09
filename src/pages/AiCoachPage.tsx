import { FormEvent, useMemo, useState } from "react";
import { ArrowRight, BrainCircuit, CheckCircle2, ClipboardCheck, Cpu, Loader2, MessageSquareText, Sparkles, Target } from "lucide-react";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import lessons from "../data/lessons.json";
import featuredCases from "../data/featured-cases.json";
import vocabulary from "../data/vocabulary.json";
import simulations from "../data/simulations.json";
import type { Lesson } from "../types/lesson";
import type { CaseStudy } from "../types/caseStudy";
import type { VocabularyTerm } from "../types/vocabulary";
import { buildStudyItems, keywordStudySearch, semanticStudySearch, StudyMatch } from "../utils/localAi";
import { useAnalyticsStore } from "../store/analyticsStore";
import { useUserStore } from "../store/userStore";
import { getAccuracy, getCurrentSubject, getNextAction } from "../utils/learningFlow";

const promptStarters = [
  "I keep missing audit evidence and fraud risk questions",
  "I understand revenue recognition basics but miss simulations",
  "I need a 45-minute study plan for REG basis and gain",
  "I am weak on access controls, SOC reports, and change management",
] as const;

function buildCoachPlan(query: string, matches: StudyMatch[]) {
  const top = matches[0];
  const lower = query.toLowerCase();
  const skill =
    lower.includes("sim") || lower.includes("task")
      ? "simulation response"
      : lower.includes("forget") || lower.includes("term") || lower.includes("vocab")
        ? "active recall"
        : lower.includes("risk") || lower.includes("evidence") || lower.includes("fraud")
          ? "evidence and risk judgment"
          : "concept-to-practice transfer";

  return [
    `Start with ${top ? `${top.kind.toLowerCase()} "${top.title}"` : "one focused lesson"} so the rule is clear before practice.`,
    `Use Recall Lab for 10 terms connected to ${top?.subject || "your weak area"} and predict each definition before revealing it.`,
    `Do 10 targeted practice questions, then write why every missed option was tempting but wrong.`,
    `Finish with one ${skill} rep: issue, evidence, rule, conclusion, recommendation.`,
  ];
}

export default function AiCoachPage() {
  const analytics = useAnalyticsStore();
  const { profile } = useUserStore();
  const [query, setQuery] = useState("I keep missing audit evidence and fraud risk questions");
  const [matches, setMatches] = useState<StudyMatch[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "local" | "fallback" | "error">("idle");
  const [message, setMessage] = useState("Transformers.js runs in your browser. First model load can take a moment.");
  const items = useMemo(
    () =>
      buildStudyItems(
        lessons as Lesson[],
        featuredCases as CaseStudy[],
        vocabulary as VocabularyTerm[],
        simulations
      ),
    []
  );
  const currentSubject = getCurrentSubject(profile, analytics);
  const nextAction = getNextAction(profile, analytics);
  const accuracy = getAccuracy(analytics);
  const coachPlan = matches.length ? buildCoachPlan(query, matches) : [];

  const runCoach = async (event?: FormEvent) => {
    event?.preventDefault();
    if (!query.trim()) return;
    setStatus("loading");
    setMessage("Loading local model and searching your study library...");

    try {
      const results = await semanticStudySearch(query, items);
      setMatches(results);
      setStatus("local");
      setMessage("Local AI semantic search completed in your browser.");
    } catch {
      const results = keywordStudySearch(query, items);
      setMatches(results);
      setStatus("fallback");
      setMessage("Using offline keyword fallback. The local model may still be downloading or unavailable.");
    }
  };

  return (
    <MainLayout>
      <div className="page-container space-y-6">
        <section className="learning-hero">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-primary">Local-First AI</p>
            <h1 className="mt-2 text-3xl font-extrabold md:text-5xl">AI Coach</h1>
            <p className="mt-4 text-slate-600 dark:text-slate-200">
              Ask what you are struggling with. The coach searches lessons, Recall Lab terms, simulations, practice topics, and real cases,
              then turns the results into a study loop.
            </p>
          </div>
          <div className="card bg-slate-50 dark:bg-slate-900">
            <Cpu className="text-primary" size={28} />
            <h2 className="mt-3 text-xl font-bold">Privacy-first behavior</h2>
            <p className="mt-2">Your prompt is processed in-browser. If the model cannot load, the app falls back to offline keyword matching.</p>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <div className="card">
            <p className="text-sm font-bold uppercase tracking-wide text-primary">Focus</p>
            <h2 className="mt-2 text-3xl font-extrabold">{currentSubject}</h2>
            <p>Current study subject</p>
          </div>
          <div className="card">
            <p className="text-sm font-bold uppercase tracking-wide text-primary">Accuracy</p>
            <h2 className="mt-2 text-3xl font-extrabold">{accuracy}%</h2>
            <p>{analytics.correctAnswers}/{analytics.questionsAnswered} correct</p>
          </div>
          <div className="card">
            <p className="text-sm font-bold uppercase tracking-wide text-primary">Coach Library</p>
            <h2 className="mt-2 text-3xl font-extrabold">{items.length}</h2>
            <p>Lessons, recall, sims, cases, practice</p>
          </div>
          <div className="card">
            <p className="text-sm font-bold uppercase tracking-wide text-primary">Next Action</p>
            <h2 className="mt-2 text-xl font-extrabold">{nextAction.label}</h2>
            <Link to={nextAction.route} className="mt-3 inline-flex items-center gap-2 font-bold text-primary">
              Go now <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        <section className="card">
          <form onSubmit={runCoach}>
            <label htmlFor="ai-query">What do you want help with?</label>
            <textarea
              id="ai-query"
              className="mt-2 min-h-32 w-full"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Example: I understand revenue recognition basics but miss lease classification simulations."
            />
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button className="flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-bold text-white" disabled={status === "loading"}>
                {status === "loading" ? <Loader2 className="animate-spin" size={18} /> : <BrainCircuit size={18} />}
                Find My Study Path
              </button>
              <p className="text-sm text-slate-500">{message}</p>
            </div>
          </form>
          <div className="mt-4 grid gap-2 md:grid-cols-4">
            {promptStarters.map((starter) => (
              <button
                key={starter}
                type="button"
                onClick={() => setQuery(starter)}
                className="filter-chip text-left"
              >
                {starter}
              </button>
            ))}
          </div>
        </section>

        {matches.length > 0 && (
          <>
            <section className="card">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="flex items-center gap-2 text-2xl font-bold"><ClipboardCheck size={24} /> Coach Plan</h2>
                  <p className="mt-1 text-slate-600 dark:text-slate-200">
                    Mode: {status === "local" ? "Transformers.js semantic search" : "Offline keyword fallback"}
                  </p>
                </div>
                <Sparkles className="text-primary" size={28} />
              </div>
              <ol className="landing-steps-list">
                {coachPlan.map((step) => <li key={step}>{step}</li>)}
              </ol>
            </section>

            <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
              <div className="card">
                <h2 className="flex items-center gap-2 text-2xl font-bold"><Target size={24} /> Recommended Path</h2>
                <div className="mt-4 grid gap-3">
                  {matches.map((match) => (
                    <Link key={match.id} to={match.route} className="mode-card">
                      <b>{match.kind}: {match.title}</b>
                      <small>{match.subject} / confidence {Math.round(match.score * 100)}%</small>
                      <small>{match.reason}</small>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="card">
                <h2 className="flex items-center gap-2 text-2xl font-bold"><MessageSquareText size={24} /> What to write down</h2>
                <div className="mt-4 space-y-3">
                  <p className="rounded-lg bg-slate-50 p-3 dark:bg-slate-900"><b>Before studying:</b> What exact mistake am I trying to stop making?</p>
                  <p className="rounded-lg bg-slate-50 p-3 dark:bg-slate-900"><b>During practice:</b> Which fact changed the answer?</p>
                  <p className="rounded-lg bg-slate-50 p-3 dark:bg-slate-900"><b>After feedback:</b> What is tomorrow's first rep?</p>
                  <p className="rounded-lg bg-emerald-50 p-3 text-emerald-950"><b className="flex items-center gap-2"><CheckCircle2 size={17} /> Coach rule:</b> If you cannot explain it in one sentence, go back to lesson and recall before drilling more questions.</p>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </MainLayout>
  );
}
