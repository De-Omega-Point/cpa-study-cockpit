import { useMemo, useState } from "react";
import { CheckCircle2, Clock, RotateCcw, Trophy } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import questions from "../data/questions.json";
import sourceUpdates from "../data/source-updates.json";
import type { Question, QuestionSubject } from "../types/question";
import { useAnalyticsStore } from "../store/analyticsStore";
import { useUserStore } from "../store/userStore";

const subjects = ["FAR", "AUD", "REG", "BAR", "ISC", "TCP"] as const;
const counts = [25, 50, 100, 200] as const;

type ExamState = "setup" | "active" | "results";

function buildExam(bank: Question[], subject: QuestionSubject, count: number) {
  const subjectBank = bank.filter((question) => question.subject === subject);
  const hard = subjectBank.filter((question) => question.difficulty === "hard");
  const medium = subjectBank.filter((question) => question.difficulty === "medium");
  const easy = subjectBank.filter((question) => question.difficulty === "easy");
  const mixed = [...hard, ...medium, ...easy];
  return Array.from({ length: Math.min(count, mixed.length) }, (_, index) => mixed[(index * 7) % mixed.length]);
}

function getFeedback(score: number) {
  if (score >= 85) return "Exam-ready trend. Shift to timed simulations, review missed explanations, and protect retention.";
  if (score >= 75) return "Passing range, but still fragile. Review every missed topic and retest with mixed sets.";
  if (score >= 60) return "Developing. Return to Deep Dive for weak topics, then run a 50-question targeted set.";
  return "Foundation reset needed. Study fewer topics at a time, then practice with explanations before another long exam.";
}

export default function PracticeExamPage() {
  const analytics = useAnalyticsStore();
  const { addXP } = useUserStore();
  const [subject, setSubject] = useState<(typeof subjects)[number]>("FAR");
  const [count, setCount] = useState<(typeof counts)[number]>(50);
  const [state, setState] = useState<ExamState>("setup");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const bank = questions as Question[];
  const exam = useMemo(() => buildExam(bank, subject, count), [bank, subject, count]);
  const current = exam[index];
  const correct = exam.filter((question) => answers[question.id] === question.answer);
  const score = exam.length ? Math.round((correct.length / exam.length) * 100) : 0;
  const missed = exam.filter((question) => answers[question.id] && answers[question.id] !== question.answer);
  const weakTopics = Array.from(new Set(missed.map((question) => question.topic || question.blueprintMapping?.group || question.subject))).slice(0, 8);
  const answeredCount = exam.filter((question) => answers[question.id]).length;
  const progress = exam.length ? Math.round(((index + 1) / exam.length) * 100) : 0;

  const startExam = () => {
    setAnswers({});
    setIndex(0);
    setState("active");
  };

  const finishExam = () => {
    exam.forEach((question) => analytics.answerQuestion(answers[question.id] === question.answer));
    analytics.completeMockExam();
    if (score >= 75) addXP(250);
    setState("results");
  };

  return (
    <MainLayout>
      <div className="page-container space-y-6">
        <section className="page-heading">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-primary">Practice Exam Center</p>
            <h1 className="section-title">Actual Practice Test Area</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-200">Run a real exam-style set from the 2,000-question bank, including 200-question endurance mode.</p>
          </div>
        </section>

        {state === "setup" && (
          <section className="grid gap-4 lg:grid-cols-[1fr_420px]">
            <div className="card">
              <h2 className="text-xl font-bold">Build Your Test</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label>
                  Section
                  <select className="mt-1 w-full" value={subject} onChange={(event) => setSubject(event.target.value as typeof subject)}>
                    {subjects.map((option) => <option key={option}>{option}</option>)}
                  </select>
                </label>
                <label>
                  Question Count
                  <select className="mt-1 w-full" value={count} onChange={(event) => setCount(Number(event.target.value) as typeof count)}>
                    {counts.map((option) => <option key={option}>{option}</option>)}
                  </select>
                </label>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-4">
                {counts.map((option) => (
                  <button key={option} onClick={() => setCount(option)} className={`mode-card ${count === option ? "module-row-active" : ""}`}>
                    <Trophy size={20} />
                    <b>{option} Questions</b>
                    <small>{option === 200 ? "Endurance exam" : "Focused set"}</small>
                  </button>
                ))}
              </div>
              <button onClick={startExam} className="mt-5 rounded-lg bg-primary px-5 py-3 font-bold text-white">
                Start Practice Test
              </button>
            </div>

            <aside className="card">
              <div className="flex items-center gap-3">
                <Clock size={22} />
                <h2 className="text-xl font-bold">Exam Reality Check</h2>
              </div>
              <p className="mt-3">Official CPA sections are four hours and use MCQ plus task-based simulation testlets. This practice area adds a 200-question endurance mode for extra repetition, not as a claim that the official exam has 200 questions.</p>
              <p className="mt-3"><b>Source:</b> {sourceUpdates.sources[0].name}</p>
            </aside>
          </section>
        )}

        {state === "active" && current && (
          <section className="exam-shell">
            <div className="exam-toolbar">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-primary">{subject} / Question {index + 1} of {exam.length}</p>
                <p className="mt-1 text-slate-600 dark:text-slate-200">{answeredCount} answered / {exam.length - answeredCount} remaining</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <b>{progress}%</b>
                  <p className="text-sm text-slate-500">Progress</p>
                </div>
                <button onClick={() => setState("setup")} className="rounded-lg border border-slate-300 px-4 py-2 font-bold">
                  Exit
                </button>
              </div>
            </div>
            <div className="progress-track mt-4">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>

            <div className="exam-question">
              <p className="text-sm font-bold uppercase tracking-wide text-primary">{current.difficulty} / {current.type}</p>
              <h2 className="mt-2 text-2xl font-bold">{current.question}</h2>
            </div>

            <div className="mt-5 space-y-3">
              {current.options?.map((option) => (
                <label key={option} className={`answer-choice ${answers[current.id] === option ? "answer-choice-active" : ""}`}>
                  <input
                    type="radio"
                    name={current.id}
                    checked={answers[current.id] === option}
                    onChange={() => setAnswers((value) => ({ ...value, [current.id]: option }))}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                className="rounded-lg bg-secondary px-4 py-2 font-bold text-white disabled:opacity-70"
                disabled={index === 0}
                onClick={() => setIndex((value) => Math.max(0, value - 1))}
              >
                Previous
              </button>
              {index < exam.length - 1 ? (
                <button className="rounded-lg bg-primary px-4 py-2 font-bold text-white" onClick={() => setIndex((value) => value + 1)}>
                  Next
                </button>
              ) : (
                <button className="rounded-lg bg-primary px-4 py-2 font-bold text-white" onClick={finishExam}>
                  Finish and Score
                </button>
              )}
            </div>
          </section>
        )}

        {state === "results" && (
          <section className="grid gap-4 lg:grid-cols-[360px_1fr]">
            <aside className="card">
              <CheckCircle2 size={32} className="text-primary" />
              <h2 className="mt-3 text-2xl font-bold">Score: {score}%</h2>
              <p className="mt-2">{correct.length} correct out of {exam.length}</p>
              <p className="mt-3">{getFeedback(score)}</p>
              <button onClick={() => setState("setup")} className="mt-5 flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 font-bold text-white">
                <RotateCcw size={18} /> Build Another Test
              </button>
            </aside>
            <div className="card">
              <h2 className="text-xl font-bold">Feedback and Weak Areas</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <section>
                  <h3 className="font-bold">Weak Topics</h3>
                  {weakTopics.length ? (
                    <ul className="mt-2 list-disc pl-6">
                      {weakTopics.map((topic) => <li key={topic}>{topic}</li>)}
                    </ul>
                  ) : (
                    <p className="mt-2">No weak topics detected from this set.</p>
                  )}
                </section>
                <section>
                  <h3 className="font-bold">Next Study Move</h3>
                  <p className="mt-2">Deep dive weak topics, redo missed explanations aloud, then run a shorter targeted set before another full test.</p>
                </section>
              </div>
              <div className="mt-5 space-y-3">
                {missed.slice(0, 12).map((question) => (
                  <details key={question.id} className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                    <summary className="cursor-pointer font-bold">{question.topic || question.subject}: {question.question}</summary>
                    <p className="mt-2"><b>Your answer:</b> {answers[question.id]}</p>
                    <p><b>Correct answer:</b> {question.answer}</p>
                    <p><b>Explanation:</b> {question.explanation}</p>
                    <p><b>Exam tip:</b> {question.examTip}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </MainLayout>
  );
}
