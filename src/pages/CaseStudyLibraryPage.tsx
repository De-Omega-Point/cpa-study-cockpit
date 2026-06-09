import { useMemo, useState } from "react";
import { BriefcaseBusiness, ExternalLink, Star } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import LearningFlow from "../components/LearningFlow";
import featuredCases from "../data/featured-cases.json";
import { useAnalyticsStore } from "../store/analyticsStore";
import { useUserStore } from "../store/userStore";
import type { CaseStudy } from "../types/caseStudy";

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-1 pl-6">
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  );
}

export default function CaseStudyLibraryPage() {
  const analytics = useAnalyticsStore();
  const user = useUserStore();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const allCases = featuredCases as CaseStudy[];
  const filtered = useMemo(
    () =>
      allCases.filter((study) => {
        const query = search.toLowerCase();
        return (
          study.title.toLowerCase().includes(query) ||
          study.company.toLowerCase().includes(query) ||
          study.category.toLowerCase().includes(query)
        );
      }),
    [allCases, search]
  );
  const selected = filtered.find((study) => study.id === selectedId) || filtered[0];

  return (
    <MainLayout>
      <div className="page-container space-y-6">
        <section className="page-heading">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-primary">Step 5 / Judge</p>
            <h1 className="section-title">Case Study Library</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-200">{filtered.length} real source-backed cases for deep professional judgment study</p>
          </div>
          <input
            className="w-full md:w-80"
            placeholder="Search cases..."
            value={search}
            onChange={(event) => { setSearch(event.target.value); setSelectedId(null); }}
          />
        </section>

        <LearningFlow />

        <section className="grid gap-4 lg:grid-cols-[320px_1fr]">
          <aside className="card h-fit">
            <div className="flex items-center gap-3">
              <span className="rounded-lg bg-emerald-50 p-2 text-primary"><BriefcaseBusiness size={18} /></span>
              <div>
                <h2 className="font-bold">Case Queue</h2>
                <p className="text-sm text-slate-500">Study one case deeply</p>
              </div>
            </div>
            <div className="mt-4 max-h-[70vh] space-y-2 overflow-auto pr-1">
              {filtered.map((study) => {
                const featured = study.id.startsWith("featured-");
                return (
                <button
                  key={study.id}
                  onClick={() => setSelectedId(study.id)}
                  className={`module-row ${selected?.id === study.id ? "module-row-active" : ""}`}
                >
                  <span>{featured ? <Star size={16} /> : study.id.replace("case-", "")}</span>
                  <span>
                    <b>{study.company}</b>
                    <small>{featured ? "Featured / " : ""}{study.category}</small>
                  </span>
                </button>
                );
              })}
            </div>
          </aside>

          {selected && (
            <article className="card">
              <p className="text-xs font-bold uppercase text-primary">{selected.id.startsWith("featured-") ? "Featured Case / " : ""}{selected.company} / {selected.category}</p>
              <h2 className="mt-1 text-2xl font-bold">{selected.title}</h2>
              {selected.background && <p className="mt-3">{selected.background}</p>}
              <p className="mt-3">{selected.summary}</p>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <section>
                  <h3 className="font-bold">Timeline</h3>
                  <div className="mt-2 space-y-2 text-sm">
                    {selected.timeline.map((event) => (
                      <p key={`${selected.id}-${event.year}`}><b>{event.year}:</b> {event.event}</p>
                    ))}
                  </div>
                </section>
                <section>
                  <h3 className="font-bold">Root Cause</h3>
                  <p className="mt-2 text-sm">{selected.rootCause || "Root cause analysis available through failure analysis."}</p>
                </section>
                <section>
                  <h3 className="font-bold">Failure Analysis</h3>
                  <BulletList items={selected.failureAnalysis} />
                </section>
                <section>
                  <h3 className="font-bold">CPA Lessons</h3>
                  <BulletList items={selected.lessonsLearned || selected.lessons || []} />
                </section>
                {selected.ethicsAnalysis && (
                  <section>
                    <h3 className="font-bold">Ethics Analysis</h3>
                    <p className="mt-2 text-sm">{selected.ethicsAnalysis}</p>
                  </section>
                )}
                {selected.auditAnalysis && (
                  <section>
                    <h3 className="font-bold">Audit Analysis</h3>
                    <p className="mt-2 text-sm">{selected.auditAnalysis}</p>
                  </section>
                )}
                <section>
                  <h3 className="font-bold">Exam Relevance</h3>
                  <BulletList items={selected.cpaExamRelevance || selected.examRelevance || []} />
                </section>
                {selected.criticalThinkingQuestions && (
                  <section>
                    <h3 className="font-bold">Critical Thinking</h3>
                    <BulletList items={selected.criticalThinkingQuestions} />
                  </section>
                )}
                <section>
                  <h3 className="font-bold">TOWS</h3>
                  <div className="mt-2 space-y-2 text-sm">
                    <p><b>Strengths:</b> {selected.tows.strengths.join(", ")}</p>
                    <p><b>Weaknesses:</b> {selected.tows.weaknesses.join(", ")}</p>
                    <p><b>Opportunities:</b> {selected.tows.opportunities.join(", ")}</p>
                    <p><b>Threats:</b> {selected.tows.threats.join(", ")}</p>
                  </div>
                </section>
                {selected.quiz.length > 0 && (
                  <section>
                    <h3 className="font-bold">Case Quiz</h3>
                    <div className="mt-2 space-y-3">
                      {selected.quiz.slice(0, 3).map((item) => (
                        <div key={item.question} className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                          <p><b>Question:</b> {item.question}</p>
                          <p><b>Answer:</b> {item.answer}</p>
                          {item.explanation && <p><b>Why:</b> {item.explanation}</p>}
                        </div>
                      ))}
                    </div>
                  </section>
                )}
                {selected.sources && selected.sources.length > 0 && (
                  <section className="md:col-span-2">
                    <h3 className="font-bold">Sources</h3>
                    <div className="mt-2 grid gap-2 md:grid-cols-2">
                      {selected.sources.map((source) => (
                        <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="rounded-lg border border-slate-200 p-3 font-bold text-primary dark:border-slate-700">
                          {source.label} <ExternalLink className="inline" size={16} />
                        </a>
                      ))}
                    </div>
                  </section>
                )}
              </div>

              <button
                onClick={() => {
                  analytics.completeCaseStudy();
                  user.addXP(50);
                }}
                className="mt-5 rounded bg-primary px-4 py-2 font-semibold text-white"
              >
                Complete Case +50 XP
              </button>
            </article>
          )}
        </section>
      </div>
    </MainLayout>
  );
}
