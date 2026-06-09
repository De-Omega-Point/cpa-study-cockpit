import { useMemo, useState } from "react";
import { BookOpen, CheckCircle2, Search } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import LearningFlow from "../components/LearningFlow";
import lessons from "../data/lessons.json";
import LessonRenderer from "../components/LessonRenderer";
import type { Lesson } from "../types/lesson";
import { getCurrentSubject } from "../utils/learningFlow";
import { useUserStore } from "../store/userStore";
import { useAnalyticsStore } from "../store/analyticsStore";

const subjectOptions = ["ALL", "FAR", "AUD", "REG", "BAR", "ISC", "TCP", "HISTORY"] as const;

function displayTitle(title: string) {
  return title.replace(/ Mastery$/, "");
}

export default function AcademyHome() {
  const { profile } = useUserStore();
  const analytics = useAnalyticsStore();
  const recommendedSubject = getCurrentSubject(profile, analytics);
  const [subject, setSubject] = useState<(typeof subjectOptions)[number]>(recommendedSubject as (typeof subjectOptions)[number]);
  const [query, setQuery] = useState("");
  const allLessons = lessons as Lesson[];
  const filtered = useMemo(
    () =>
      allLessons.filter((lesson) => {
        const matchesSubject = subject === "ALL" || lesson.subject === subject;
        const text = `${lesson.title} ${lesson.subject} ${lesson.chapter} ${lesson.discipline || ""}`.toLowerCase();
        return matchesSubject && text.includes(query.toLowerCase());
      }),
    [allLessons, subject, query]
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = filtered.find((lesson) => lesson.id === selectedId) || filtered[0];

  return (
    <MainLayout>
      <div className="page-container space-y-6">
        <section className="page-heading">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-primary">Learning Library</p>
            <h1 className="section-title">Guided Lessons</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-200">
              Browse all {allLessons.length} modules, filter by section, then open one lesson at a time.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {subjectOptions.map((option) => (
              <button
                key={option}
                onClick={() => {
                  setSubject(option);
                  setSelectedId(null);
                }}
                className={`filter-chip ${subject === option ? "filter-chip-active" : ""}`}
              >
                {option}
              </button>
            ))}
          </div>
        </section>

        <LearningFlow />

        <section className="grid gap-4 xl:grid-cols-[360px_1fr]">
          <aside className="card h-fit xl:sticky xl:top-24">
            <div className="flex items-center gap-3">
              <span className="rounded-lg bg-emerald-50 p-2 text-primary"><BookOpen size={18} /></span>
              <div>
                <h2 className="font-bold">{subject === "ALL" ? "All Modules" : `${subject} Modules`}</h2>
                <p className="text-sm text-slate-500">{filtered.length} visible lessons</p>
              </div>
            </div>

            <label className="mt-4 flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2">
              <Search size={18} />
              <input
                className="min-h-0 w-full border-0 bg-transparent p-0 focus:outline-none"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setSelectedId(null);
                }}
                placeholder="Search lessons"
              />
            </label>

            <div className="lesson-library mt-4">
              {filtered.map((lesson, index) => {
                const active = selected && lesson.id === selected.id;
                return (
                  <button
                    key={lesson.id}
                    onClick={() => setSelectedId(lesson.id)}
                    className={`lesson-library-row ${active ? "lesson-library-row-active" : ""}`}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <span>
                      <b>{displayTitle(lesson.title)}</b>
                      <small>{lesson.subject} / {lesson.chapter}</small>
                    </span>
                    {active && <CheckCircle2 size={16} />}
                  </button>
                );
              })}
            </div>
          </aside>

          <div className="space-y-4">
            <div className="card grid gap-4 md:grid-cols-4">
              <div>
                <h3 className="font-bold">1. Pick</h3>
                <p className="mt-1 text-sm text-slate-500">Choose a section or search the whole library.</p>
              </div>
              <div>
                <h3 className="font-bold">2. Learn</h3>
                <p className="mt-1 text-sm text-slate-500">Read the concept and examples.</p>
              </div>
              <div>
                <h3 className="font-bold">3. Decide</h3>
                <p className="mt-1 text-sm text-slate-500">Use the scenario and judgment prompts.</p>
              </div>
              <div>
                <h3 className="font-bold">4. Practice</h3>
                <p className="mt-1 text-sm text-slate-500">Move into recall or questions.</p>
              </div>
            </div>
            {selected ? (
              <LessonRenderer lesson={selected} />
            ) : (
              <div className="card py-10 text-center">
                <h2 className="text-2xl font-bold">No lessons match that search.</h2>
                <p className="mx-auto mt-2 text-slate-600">Try another section or a shorter search term.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
