import { useMemo, useState } from "react";
import { Brain, CheckCircle2, ClipboardCheck, Eye, Lightbulb, ListChecks, TimerReset, XCircle } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import simulations from "../data/simulations.json";
import { useAnalyticsStore } from "../store/analyticsStore";
import { useUserStore } from "../store/userStore";

interface MicroLearning {
  plainEnglish: string;
  examTrap: string;
  decisionRule: string;
  memoryHook: string;
}

interface QuickCheck {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

interface Simulation {
  id: string;
  subject: string;
  title: string;
  skill: string;
  timeLimitMinutes: number;
  microLearning: MicroLearning;
  scenario: string;
  exhibits: string[];
  tasks: string[];
  hints: string[];
  quickChecks: QuickCheck[];
  rubric: string[];
  modelAnswer: string;
}

function scoreResponse(response: string, rubric: string[]) {
  const normalized = response.toLowerCase();
  const hits = rubric.filter((item) => normalized.includes(item.toLowerCase()));
  const score = Math.round((hits.length / Math.max(rubric.length, 1)) * 100);
  const missing = rubric.filter((item) => !hits.includes(item));
  return { score, hits, missing };
}

function getSimulationFeedback(score: number) {
  if (score >= 85) return "Strong simulation response. You connected the facts to the professional judgment points.";
  if (score >= 65) return "Good foundation. Add more evidence, consequences, and specific recommendation language.";
  if (score >= 40) return "Partial response. You saw some issues, but need more complete rubric coverage.";
  return "Needs rebuilding. Start by listing the issue, evidence, rule, conclusion, and recommendation.";
}

export default function SimulationLabPage() {
  const analytics = useAnalyticsStore();
  const { addXP } = useUserStore();
  const allSimulations = simulations as Simulation[];
  const subjects = useMemo(() => Array.from(new Set(allSimulations.map((simulation) => simulation.subject))), [allSimulations]);
  const [subject, setSubject] = useState(subjects[0] || "FAR");
  const subjectSims = useMemo(() => allSimulations.filter((simulation) => simulation.subject === subject), [allSimulations, subject]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = subjectSims.find((simulation) => simulation.id === selectedId) || subjectSims[0] || allSimulations[0];
  const [response, setResponse] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [quickCheckAnswers, setQuickCheckAnswers] = useState<Record<string, string>>({});
  const result = scoreResponse(response, selected.rubric);
  const answeredChecks = selected.quickChecks.filter((check) => quickCheckAnswers[check.question]).length;
  const correctChecks = selected.quickChecks.filter((check) => quickCheckAnswers[check.question] === check.answer).length;

  const resetPracticeState = () => {
    setSubmitted(false);
    setResponse("");
    setShowHints(false);
    setQuickCheckAnswers({});
  };

  const submit = () => {
    setSubmitted(true);
    analytics.completeMockExam();
    if (result.score >= 70) addXP(150);
  };

  return (
    <MainLayout>
      <div className="page-container space-y-6">
        <section className="page-heading">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-primary">Simulation Testing</p>
            <h1 className="section-title">Simulation Lab</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-200">
              Learn the idea, work the exhibits, answer quick checks, then write and score a task-based response.
            </p>
          </div>
          <select value={subject} onChange={(event) => { setSubject(event.target.value); setSelectedId(null); resetPracticeState(); }}>
            {subjects.map((option) => <option key={option}>{option}</option>)}
          </select>
        </section>

        <section className="grid gap-4 xl:grid-cols-[360px_1fr]">
          <aside className="card h-fit xl:sticky xl:top-24">
            <div className="flex items-center gap-3">
              <span className="rounded-lg bg-emerald-50 p-2 text-primary"><ClipboardCheck size={18} /></span>
              <div>
                <h2 className="font-bold">{subject} Simulations</h2>
                <p className="text-sm text-slate-500">{subjectSims.length} guided task-based simulations</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {subjectSims.map((simulation, index) => (
                <button
                  key={simulation.id}
                  onClick={() => {
                    setSelectedId(simulation.id);
                    resetPracticeState();
                  }}
                  className={`module-row ${selected.id === simulation.id ? "module-row-active" : ""}`}
                >
                  <span>{index + 1}</span>
                  <span>
                    <b>{simulation.title}</b>
                    <small>{simulation.skill} / {simulation.timeLimitMinutes} minutes</small>
                  </span>
                </button>
              ))}
            </div>
          </aside>

          <article className="exam-shell">
            <div className="exam-toolbar">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-primary">{selected.subject} / TBS practice / {selected.skill}</p>
                <h2 className="mt-2 text-2xl font-bold">{selected.title}</h2>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-3 font-bold dark:bg-slate-900">
                  <TimerReset size={18} /> {selected.timeLimitMinutes} min
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-3 font-bold dark:bg-slate-900">
                  <ListChecks size={18} /> {correctChecks}/{selected.quickChecks.length} checks
                </div>
              </div>
            </div>

            <section className="lesson-section lesson-section-accent">
              <h3 className="flex items-center gap-2"><Brain size={20} /> Micro-Learning First</h3>
              <div className="prompt-grid mt-3">
                <p><b>Plain English:</b> {selected.microLearning.plainEnglish}</p>
                <p><b>Exam Trap:</b> {selected.microLearning.examTrap}</p>
                <p><b>Decision Rule:</b> {selected.microLearning.decisionRule}</p>
                <p><b>Memory Hook:</b> {selected.microLearning.memoryHook}</p>
              </div>
            </section>

            <section className="mt-5 px-5">
              <h3 className="font-bold">Scenario</h3>
              <p className="mt-2 leading-7">{selected.scenario}</p>
            </section>

            <section className="mt-5 grid gap-4 px-5 md:grid-cols-2">
              <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                <h3 className="font-bold">Exhibits</h3>
                <ul className="mt-2 list-disc space-y-2 pl-6">
                  {selected.exhibits.map((exhibit) => <li key={exhibit}>{exhibit}</li>)}
                </ul>
              </div>
              <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                <h3 className="font-bold">Tasks</h3>
                <ul className="mt-2 list-disc space-y-2 pl-6">
                  {selected.tasks.map((task) => <li key={task}>{task}</li>)}
                </ul>
              </div>
            </section>

            <section className="mt-5 px-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold">Quick Checks</h3>
                  <p className="text-sm text-slate-500">
                    Answer these before writing so the simulation feels less like a blank page.
                  </p>
                </div>
                <span className="rounded-lg bg-slate-50 px-3 py-2 text-sm font-bold dark:bg-slate-900">
                  {answeredChecks}/{selected.quickChecks.length} answered
                </span>
              </div>
              <div className="mt-3 grid gap-3">
                {selected.quickChecks.map((check, index) => {
                  const selectedAnswer = quickCheckAnswers[check.question];
                  const isCorrect = selectedAnswer === check.answer;
                  return (
                    <div key={check.question} className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                      <p className="font-bold">{index + 1}. {check.question}</p>
                      <div className="mt-3 grid gap-2">
                        {check.options.map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setQuickCheckAnswers((current) => ({ ...current, [check.question]: option }))}
                            className={`answer-choice ${selectedAnswer === option ? "answer-choice-active" : ""}`}
                          >
                            <span>{option}</span>
                          </button>
                        ))}
                      </div>
                      {selectedAnswer && (
                        <div className={`mt-3 rounded-lg p-3 text-sm ${isCorrect ? "bg-emerald-50 text-emerald-900" : "bg-amber-50 text-amber-950"}`}>
                          <b className="flex items-center gap-2">
                            {isCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                            {isCorrect ? "Correct" : `Review: ${check.answer}`}
                          </b>
                          <p className="mt-1">{check.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="mt-5 px-5">
              <button
                type="button"
                onClick={() => setShowHints((current) => !current)}
                className="icon-button"
              >
                <Eye size={18} /> {showHints ? "Hide Hints" : "Reveal Hints"}
              </button>
              {showHints && (
                <div className="feedback-panel mt-3">
                  <h3 className="font-bold">Hints</h3>
                  <ul className="mt-2 list-disc space-y-2 pl-6">
                    {selected.hints.map((hint) => <li key={hint}>{hint}</li>)}
                  </ul>
                </div>
              )}
            </section>

            <section className="mt-5 px-5">
              <label htmlFor="simulation-response">Your Simulation Response</label>
              <textarea
                id="simulation-response"
                className="mt-2 min-h-56 w-full"
                value={response}
                onChange={(event) => setResponse(event.target.value)}
                placeholder="Use this structure: Issue -> Evidence -> Rule/decision test -> Conclusion -> Recommendation."
              />
            </section>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-5 py-4 dark:border-slate-700">
              <p className="text-sm text-slate-500">{response.trim().length < 40 ? "Write at least 40 characters to unlock rubric feedback." : "Ready for rubric feedback."}</p>
              <button onClick={submit} disabled={response.trim().length < 40} className="rounded-lg bg-primary px-5 py-3 font-bold text-white">
                Submit for Feedback
              </button>
            </div>

            {submitted && (
              <section className="feedback-panel m-5">
                <div>
                  <h3 className="text-xl font-bold">Rubric Score: {result.score}%</h3>
                  <p className="mt-2">{getSimulationFeedback(result.score)}</p>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-bold">Covered</h4>
                    <ul className="mt-2 list-disc pl-6">
                      {result.hits.length ? result.hits.map((item) => <li key={item}>{item}</li>) : <li>No rubric terms detected yet.</li>}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold">Add Next Time</h4>
                    <ul className="mt-2 list-disc pl-6">
                      {result.missing.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                </div>
                <div className="mt-5 rounded-lg bg-slate-50 p-4 dark:bg-slate-900">
                  <div className="flex items-center gap-2 font-bold"><Lightbulb size={18} /> Model Answer</div>
                  <p className="mt-2">{selected.modelAnswer}</p>
                </div>
              </section>
            )}
          </article>
        </section>
      </div>
    </MainLayout>
  );
}
