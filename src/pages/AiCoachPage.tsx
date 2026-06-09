import { FormEvent, useMemo, useState } from "react";
import { BrainCircuit, Cpu, Loader2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import lessons from "../data/lessons.json";
import featuredCases from "../data/featured-cases.json";
import type { Lesson } from "../types/lesson";
import type { CaseStudy } from "../types/caseStudy";
import { buildStudyItems, keywordStudySearch, semanticStudySearch, StudyMatch } from "../utils/localAi";

export default function AiCoachPage() {
  const [query, setQuery] = useState("I keep missing audit evidence and fraud risk questions");
  const [matches, setMatches] = useState<StudyMatch[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "local" | "fallback" | "error">("idle");
  const [message, setMessage] = useState("Transformers.js runs in your browser. First model load can take a moment.");
  const items = useMemo(() => buildStudyItems(lessons as Lesson[], featuredCases as CaseStudy[]), []);

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
              Ask what you are struggling with. The coach uses Transformers.js locally in your browser to find relevant lessons and real cases.
            </p>
          </div>
          <div className="card bg-slate-50 dark:bg-slate-900">
            <Cpu className="text-primary" size={28} />
            <h2 className="mt-3 text-xl font-bold">Privacy-first behavior</h2>
            <p className="mt-2">Your prompt is processed in-browser. If the model cannot load, the app falls back to offline keyword matching.</p>
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
        </section>

        {matches.length > 0 && (
          <section className="card">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold">Recommended Path</h2>
                <p className="mt-1 text-slate-600 dark:text-slate-200">
                  Mode: {status === "local" ? "Transformers.js semantic search" : "Offline keyword fallback"}
                </p>
              </div>
              <Sparkles className="text-primary" size={28} />
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {matches.map((match) => (
                <Link key={match.id} to={match.route} className="mode-card">
                  <b>{match.kind}: {match.title}</b>
                  <small>{match.subject} / confidence {Math.round(match.score * 100)}%</small>
                  <small>{match.reason}</small>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </MainLayout>
  );
}
