import { useMemo, useState } from "react";
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

export default function VocabularyMasterPage() {
  const analytics = useAnalyticsStore();
  const { profile } = useUserStore();
  const recommendedSubject = getCurrentSubject(profile, analytics);
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState<(typeof subjects)[number]>(recommendedSubject as (typeof subjects)[number]);
  const [difficulty, setDifficulty] = useState<(typeof difficulties)[number]>("ALL");
  const allTerms = terms as VocabularyTerm[];
  const filtered = useMemo(
    () =>
      allTerms.filter((term) => {
        const query = search.toLowerCase();
        const matchesText =
          term.term.toLowerCase().includes(query) ||
          term.definition.toLowerCase().includes(query) ||
          term.simpleDefinition.toLowerCase().includes(query);
        const matchesSubject = subject === "ALL" || term.subject === subject;
        const matchesDifficulty = difficulty === "ALL" || term.difficulty === difficulty;
        return matchesText && matchesSubject && matchesDifficulty;
      }),
    [allTerms, search, subject, difficulty]
  );

  return (
    <MainLayout>
      <div className="page-container space-y-6">
        <section className="page-heading">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-primary">Step 3 / Recall</p>
            <h1 className="section-title">Vocabulary Master</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-200">{filtered.length} of {allTerms.length} terms in this queue</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <select value={subject} onChange={(event) => setSubject(event.target.value as typeof subject)}>
              {subjects.map((option) => <option key={option}>{option}</option>)}
            </select>
            <select value={difficulty} onChange={(event) => setDifficulty(event.target.value as typeof difficulty)}>
              {difficulties.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
        </section>

        <LearningFlow />

        <section className="card">
          <h2 className="text-xl font-bold">Recall Queue</h2>
          <input
            className="mt-4 w-full"
            placeholder="Search terms, definitions, or plain-English explanations..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <p className="rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-900"><b>1. Decode</b><br />Read the term and plain definition.</p>
            <p className="rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-900"><b>2. Anchor</b><br />Use the mnemonic and example.</p>
            <p className="rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-900"><b>3. Transfer</b><br />Answer the mini quiz prompt.</p>
          </div>
        </section>

        <div className="grid gap-4">
          {filtered.slice(0, 60).map((term) => (
            <VocabularyCard key={term.id} term={term} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
