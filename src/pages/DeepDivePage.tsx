import { useMemo, useState } from "react";
import { ExternalLink, GraduationCap, Layers, MessageSquareText } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import LearningFlow from "../components/LearningFlow";
import lessons from "../data/lessons.json";
import sourceUpdates from "../data/source-updates.json";
import type { Lesson } from "../types/lesson";
import { getCurrentSubject } from "../utils/learningFlow";
import { useAnalyticsStore } from "../store/analyticsStore";
import { useUserStore } from "../store/userStore";

const subjects = ["FAR", "AUD", "REG", "BAR", "ISC", "TCP", "HISTORY"] as const;

function getDeepDivePrompts(subject: string, title: string) {
  return [
    `What rule or professional duty drives ${title}?`,
    `Which facts would change the conclusion in a ${subject} simulation?`,
    "What evidence would you ask for before finalizing the answer?",
    "Which answer choice could be true but irrelevant?",
    "How would you explain the conclusion to a client or audit manager?",
  ];
}

export default function DeepDivePage() {
  const analytics = useAnalyticsStore();
  const { profile } = useUserStore();
  const recommendedSubject = getCurrentSubject(profile, analytics);
  const [subject, setSubject] = useState<(typeof subjects)[number]>(recommendedSubject as (typeof subjects)[number]);
  const allLessons = lessons as Lesson[];
  const subjectLessons = useMemo(() => allLessons.filter((lesson) => lesson.subject === subject), [allLessons, subject]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = subjectLessons.find((lesson) => lesson.id === selectedId) || subjectLessons[0];
  const prompts = selected ? getDeepDivePrompts(selected.subject, selected.title) : [];

  return (
    <MainLayout>
      <div className="page-container space-y-6">
        <section className="page-heading">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-primary">Deep Dive Learning</p>
            <h1 className="section-title">Blueprint-Aware Deep Dive</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-200">Slow down, connect the rule to facts, and practice professional explanation.</p>
          </div>
          <select value={subject} onChange={(event) => { setSubject(event.target.value as typeof subject); setSelectedId(null); }}>
            {subjects.map((option) => <option key={option}>{option}</option>)}
          </select>
        </section>

        <LearningFlow />

        <section className="grid gap-4 lg:grid-cols-[320px_1fr]">
          <aside className="card h-fit">
            <div className="flex items-center gap-3">
              <span className="rounded-lg bg-emerald-50 p-2 text-primary"><Layers size={18} /></span>
              <div>
                <h2 className="font-bold">{subject} Deep Dives</h2>
                <p className="text-sm text-slate-500">Choose one topic to unpack.</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {subjectLessons.map((lesson, index) => (
                <button
                  key={lesson.id}
                  onClick={() => setSelectedId(lesson.id)}
                  className={`module-row ${selected?.id === lesson.id ? "module-row-active" : ""}`}
                >
                  <span>{index + 1}</span>
                  <span>
                    <b>{lesson.title}</b>
                    <small>{lesson.chapter}</small>
                  </span>
                </button>
              ))}
            </div>
          </aside>

          {selected && (
            <div className="space-y-4">
              <article className="card">
                <p className="text-sm font-bold uppercase tracking-wide text-primary">{selected.subject} / {selected.chapter}</p>
                <h2 className="mt-2 text-2xl font-extrabold">{selected.title}</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-900">
                    <GraduationCap size={22} />
                    <h3 className="mt-2 font-bold">Learn It</h3>
                    <p className="mt-1">Restate the concept in plain English before using technical language.</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-900">
                    <MessageSquareText size={22} />
                    <h3 className="mt-2 font-bold">Explain It</h3>
                    <p className="mt-1">Use facts, rule, evidence, and conclusion in that order.</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-900">
                    <Layers size={22} />
                    <h3 className="mt-2 font-bold">Transfer It</h3>
                    <p className="mt-1">Apply the idea to a simulation or messy client case.</p>
                  </div>
                </div>

                <section className="mt-6">
                  <h3 className="text-xl font-bold">Deep Explanation</h3>
                  {selected.overview.split("\n\n").map((paragraph) => <p key={paragraph} className="mt-3">{paragraph}</p>)}
                </section>

                {selected.scenarioAnalysis && (
                  <section className="mt-6 rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                    <h3 className="text-xl font-bold">Interactive Scenario</h3>
                    <p className="mt-3"><b>Scenario:</b> {selected.scenarioAnalysis.scenario}</p>
                    <p className="mt-3"><b>Your decision:</b> {selected.scenarioAnalysis.decisionRequired}</p>
                    <p className="mt-3"><b>Consequence to consider:</b> {selected.scenarioAnalysis.consequences}</p>
                    <p className="mt-3"><b>Recommended approach:</b> {selected.scenarioAnalysis.recommendedApproach}</p>
                  </section>
                )}

                <section className="mt-6">
                  <h3 className="text-xl font-bold">Socratic Prompts</h3>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    {prompts.map((prompt) => (
                      <p key={prompt} className="rounded-lg bg-slate-50 p-3 dark:bg-slate-900">{prompt}</p>
                    ))}
                  </div>
                </section>
              </article>

              <article className="card">
                <h2 className="text-xl font-bold">Current Official-Source Notes</h2>
                <p className="mt-2 text-slate-600 dark:text-slate-200">Retrieved {sourceUpdates.retrievedOn}. Use these as content guardrails for the learning path.</p>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {sourceUpdates.sources.map((source) => (
                    <section key={source.url} className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                      <a className="font-bold text-primary" href={source.url} target="_blank" rel="noreferrer">
                        {source.name} <ExternalLink className="inline" size={16} />
                      </a>
                      <ul className="mt-3 list-disc space-y-2 pl-6">
                        {source.updates.map((update) => <li key={update}>{update}</li>)}
                      </ul>
                    </section>
                  ))}
                </div>
              </article>
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  );
}
