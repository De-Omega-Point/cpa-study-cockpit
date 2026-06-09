import { useMemo, useState } from "react";
import { Brain, CheckCircle2, RotateCcw, Search, Target } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import LearningFlow from "../components/LearningFlow";
import VocabularyCard from "../components/VocabularyCard";
import terms from "../data/vocabulary.json";
import type { VocabularyTerm } from "../types/vocabulary";
import { getCurrentSubject } from "../utils/learningFlow";
import { useAnalyticsStore } from "../store/analyticsStore";
import { useUserStore } from "../store/userStore";

const subjects = ["ALL", "FAR", "AUD", "REG", "BAR", "ISC", "TCP", "GENERAL"] as const;
const difficulties = ["ALL", "easy", "medium", "hard"] as const;
const modes = ["all", "reinforcement", "exam traps"] as const;

export default function VocabularyMasterPage() {
  const analytics = useAnalyticsStore();
  const { profile } = useUserStore();
  const recommendedSubject = getCurrentSubject(profile, analytics);
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState<(typeof subjects)[number]>(recommendedSubject as (typeof subjects)[number]);
  const [difficulty, setDifficulty] = useState<(typeof difficulties)[number]>("ALL");
  const [mode, setMode] = useState<(typeof modes)[number]>("all");
  const allTerms = terms as VocabularyTerm[];
  const filtered = useMemo(
    () =>
      allTerms.filter((term) => {
        const query = search.toLowerCase();
        const matchesText =
          term.term.toLowerCase().includes(query) ||
          term.definition.toLowerCase().includes(query) ||
          term.simpleDefinition.toLowerCase().includes(query) ||
          term.relatedTerms.some((related) => related.toLowerCase().includes(query));
        const matchesSubject = subject === "ALL" || term.subject === subject;
        const matchesDifficulty = difficulty === "ALL" || term.difficulty === difficulty;
        const matchesMode =
          mode === "all" ||
          (mode === "reinforcement" && term.difficulty !== "easy") ||
          (mode === "exam traps" && Boolean(term.microLearning?.examTrap));
        return matchesText && matchesSubject && matchesDifficulty && matchesMode;
      }),
    [allTerms, search, subject, difficulty, mode]
  );
  const visibleTerms = filtered.slice(0, 60);
  const hardTerms = allTerms.filter((term) => term.difficulty === "hard").length;

  return (
    <MainLayout>
      <div className="page-container space-y-6">
        <section className="page-heading">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-primary">Step 3 / Recall</p>
            <h1 className="section-title">Recall Lab</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-200">
              Real CPA vocabulary with active recall, micro-learning, feedback, and confidence grading.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <select value={subject} onChange={(event) => setSubject(event.target.value as typeof subject)}>
              {subjects.map((option) => <option key={option}>{option}</option>)}
            </select>
            <select value={difficulty} onChange={(event) => setDifficulty(event.target.value as typeof difficulty)}>
              {difficulties.map((option) => <option key={option}>{option}</option>)}
            </select>
            <select value={mode} onChange={(event) => setMode(event.target.value as typeof mode)}>
              {modes.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
        </section>

        <LearningFlow />

        <section className="grid gap-4 md:grid-cols-4">
          <div className="card">
            <p className="text-sm font-bold uppercase tracking-wide text-primary">Terms</p>
            <h2 className="mt-2 text-3xl font-extrabold">{allTerms.length}</h2>
            <p>Curated CPA recall concepts</p>
          </div>
          <div className="card">
            <p className="text-sm font-bold uppercase tracking-wide text-primary">Queue</p>
            <h2 className="mt-2 text-3xl font-extrabold">{visibleTerms.length}</h2>
            <p>Showing from current filters</p>
          </div>
          <div className="card">
            <p className="text-sm font-bold uppercase tracking-wide text-primary">Hard Terms</p>
            <h2 className="mt-2 text-3xl font-extrabold">{hardTerms}</h2>
            <p>Use reinforcement mode</p>
          </div>
          <div className="card">
            <p className="text-sm font-bold uppercase tracking-wide text-primary">Recommended</p>
            <h2 className="mt-2 text-3xl font-extrabold">{recommendedSubject}</h2>
            <p>Your current study focus</p>
          </div>
        </section>

        <section className="card">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-bold"><Brain size={22} /> Reinforcement Loop</h2>
              <p className="mt-1 text-slate-600 dark:text-slate-200">
                Predict first, reveal second, answer the check, then grade confidence. That order builds memory better than rereading.
              </p>
            </div>
            <div className="header-search !flex !w-full !max-w-md" role="search">
              <Search size={18} />
              <input
                className="border-0 bg-transparent p-0 focus:outline-none"
                placeholder="Search terms, definitions, related concepts..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <p className="rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-900"><b className="flex items-center gap-2"><Target size={17} /> 1. Retrieve</b>Write the meaning from memory before seeing the answer.</p>
            <p className="rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-900"><b className="flex items-center gap-2"><CheckCircle2 size={17} /> 2. Check</b>Compare against the real definition and answer the mini question.</p>
            <p className="rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-900"><b className="flex items-center gap-2"><RotateCcw size={17} /> 3. Reinforce</b>Grade confidence honestly so weak concepts get another rep.</p>
          </div>
        </section>

        <div className="grid gap-4">
          {visibleTerms.map((term) => (
            <VocabularyCard key={term.id} term={term} />
          ))}
          {visibleTerms.length === 0 && (
            <section className="card">
              <h2 className="text-xl font-bold">No terms found</h2>
              <p className="mt-2">Try a broader subject, difficulty, mode, or search term.</p>
            </section>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
