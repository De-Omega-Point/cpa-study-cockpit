import { useMemo, useState } from "react";
import { Dumbbell, ListChecks, Timer, TrendingUp } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import LearningFlow from "../components/LearningFlow";
import QuestionRenderer from "../components/QuestionRenderer";
import questions from "../data/questions.json";
import { Question } from "../types/question";
import { getAccuracy, getCurrentSubject } from "../utils/learningFlow";
import { useAnalyticsStore } from "../store/analyticsStore";
import { useUserStore } from "../store/userStore";

const subjects = ["ALL", "FAR", "AUD", "REG", "BAR", "ISC", "TCP"] as const;
const difficulties = ["ALL", "easy", "medium", "hard"] as const;
const types = ["ALL", "mcq", "trueFalse", "matching", "dragDrop", "scenario", "caseStudy", "calculation", "simulation"] as const;
const modes = [
  { id: "warmup", label: "Warm-Up", icon: Dumbbell, difficulty: "easy", type: "ALL", copy: "Fast recall and confidence." },
  { id: "targeted", label: "Targeted", icon: ListChecks, difficulty: "medium", type: "mcq", copy: "Core exam decision practice." },
  { id: "simulation", label: "Simulation", icon: Timer, difficulty: "hard", type: "simulation", copy: "Slow, exhibit-style judgment." },
  { id: "mixed", label: "Mixed Review", icon: TrendingUp, difficulty: "ALL", type: "ALL", copy: "Interleaved retention." },
] as const;

export default function TestMasterPage() {
  const analytics = useAnalyticsStore();
  const { profile } = useUserStore();
  const recommendedSubject = getCurrentSubject(profile, analytics);
  const [subject, setSubject] = useState<(typeof subjects)[number]>(recommendedSubject as (typeof subjects)[number]);
  const [difficulty, setDifficulty] = useState<(typeof difficulties)[number]>("ALL");
  const [type, setType] = useState<(typeof types)[number]>("ALL");
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const lifetimeAccuracy = getAccuracy(analytics);

  const bank = useMemo(
    () =>
      (questions as Question[]).filter(
        (question) =>
          (subject === "ALL" || question.subject === subject) &&
          (difficulty === "ALL" || question.difficulty === difficulty) &&
          (type === "ALL" || question.type === type)
      ),
    [subject, difficulty, type]
  );
  const current = bank.length > 0 ? bank[idx % bank.length] : null;
  const sessionAccuracy = answered ? Math.round((score / answered) * 100) : 0;

  return (
    <MainLayout>
      <div className="page-container space-y-6">
        <section className="page-heading">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-primary">Step 4 / Practice</p>
            <h1 className="section-title">TEST MASTER</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-200">Practice in small loops, then read the explanation before moving on.</p>
          </div>
          <div className="text-right text-sm text-slate-500">
            <b className="block text-2xl text-slate-900 dark:text-white">{lifetimeAccuracy}%</b>
            Lifetime accuracy
          </div>
        </section>

        <LearningFlow />

        <section className="grid gap-3 md:grid-cols-4">
          {modes.map((mode) => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                onClick={() => {
                  setDifficulty(mode.difficulty as typeof difficulty);
                  setType(mode.type as typeof type);
                  setIdx(0);
                }}
                className="mode-card"
              >
                <Icon size={18} />
                <b>{mode.label}</b>
                <small>{mode.copy}</small>
              </button>
            );
          })}
        </section>

        <section className="card flex flex-wrap items-center gap-4">
          <select value={subject} onChange={(event) => { setSubject(event.target.value as typeof subject); setIdx(0); }}>
            {subjects.map((option) => <option key={option}>{option}</option>)}
          </select>
          <select value={difficulty} onChange={(event) => { setDifficulty(event.target.value as typeof difficulty); setIdx(0); }}>
            {difficulties.map((option) => <option key={option}>{option}</option>)}
          </select>
          <select value={type} onChange={(event) => { setType(event.target.value as typeof type); setIdx(0); }}>
            {types.map((option) => <option key={option}>{option}</option>)}
          </select>
          <b>Session {score}/{answered}</b>
          <b>Accuracy {sessionAccuracy}%</b>
          <b>Bank {bank.length}</b>
        </section>

        {current ? (
          <section>
            <div className="mb-3 flex flex-wrap gap-2 text-xs font-semibold uppercase text-slate-500">
              <span>{current.subject}</span>
              <span>{current.difficulty}</span>
              <span>{current.type}</span>
              {current.topic && <span>{current.topic}</span>}
              {current.blueprintMapping && <span>{current.blueprintMapping.skill}</span>}
            </div>
            <QuestionRenderer
              key={current.id}
              question={current}
              onScored={(correct) => {
                setAnswered((value) => value + 1);
                if (correct) setScore((value) => value + 1);
              }}
            />
          </section>
        ) : (
          <div className="card py-8 text-center text-slate-500">No questions found matching the selected criteria.</div>
        )}

        <button
          className="rounded-lg bg-secondary px-4 py-2 text-white disabled:opacity-40"
          disabled={bank.length === 0}
          onClick={() => setIdx((value) => (bank.length > 0 ? (value + 1) % bank.length : 0))}
        >
          Next Question
        </button>
      </div>
    </MainLayout>
  );
}
