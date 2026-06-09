import type { ReactNode } from "react";
import { ArrowRight, Brain, BriefcaseBusiness, ClipboardList, GraduationCap, Lightbulb, Scale, Sparkles } from "lucide-react";
import { Lesson, TerminologyEntry } from "../types/lesson";
import { useAnalyticsStore } from "../store/analyticsStore";
import { useUserStore } from "../store/userStore";

const subjectSkins: Record<string, { className: string; label: string; icon: typeof Sparkles }> = {
  FAR: { className: "lesson-skin-far", label: "Reporting Studio", icon: ClipboardList },
  AUD: { className: "lesson-skin-aud", label: "Evidence Lab", icon: Scale },
  REG: { className: "lesson-skin-reg", label: "Tax Counsel", icon: BriefcaseBusiness },
  BAR: { className: "lesson-skin-bar", label: "Analysis Desk", icon: Brain },
  ISC: { className: "lesson-skin-isc", label: "Controls Room", icon: Sparkles },
  TCP: { className: "lesson-skin-tcp", label: "Planning Table", icon: Lightbulb },
  HISTORY: { className: "lesson-skin-history", label: "Timeline Review", icon: GraduationCap },
};

const lessonModes = [
  { label: "Concept Build", focus: "Plain English first, technical terms second." },
  { label: "Scenario First", focus: "Use the business situation to anchor the rule." },
  { label: "Judgment Drill", focus: "Compare alternatives and defend a conclusion." },
  { label: "Exam Transfer", focus: "Turn the concept into test behavior." },
] as const;

function Section({ title, tone = "default", children }: { title: string; tone?: "default" | "soft" | "accent"; children: ReactNode }) {
  return (
    <section className={`lesson-section lesson-section-${tone}`}>
      <h3>{title}</h3>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-1 pl-6">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function isTermEntry(term: string | TerminologyEntry): term is TerminologyEntry {
  return typeof term !== "string";
}

function displayTitle(title: string) {
  return title.replace(/ Mastery$/, "");
}

function getLessonNumber(id: string) {
  const match = id.match(/(\d+)$/);
  return match ? Number(match[1]) : 1;
}

export default function LessonRenderer({ lesson }: { lesson: Lesson }) {
  const analytics = useAnalyticsStore();
  const user = useUserStore();
  const history = typeof lesson.historicalContext === "string" ? null : lesson.historicalContext;
  const lab = lesson.criticalThinkingLab || lesson.criticalThinking || [];
  const lessonNumber = getLessonNumber(lesson.id);
  const mode = lessonModes[(lessonNumber - 1) % lessonModes.length];
  const skin = subjectSkins[lesson.subject] || subjectSkins.FAR;
  const SkinIcon = skin.icon;
  const overviewParagraphs = lesson.overview.split("\n\n");

  return (
    <article className={`lesson-shell ${skin.className}`}>
      <header className="lesson-hero-panel">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide">{lesson.subject} / {skin.label} / {lesson.chapter}</p>
          <h2 className="mt-2 text-3xl font-extrabold">{displayTitle(lesson.title)}</h2>
          {lesson.discipline && <p className="mt-2">{lesson.discipline}</p>}
        </div>
        <div className="lesson-mode-card">
          <SkinIcon size={26} />
          <b>{mode.label}</b>
          <span>{mode.focus}</span>
        </div>
      </header>

      {lesson.masteryPath && (
        <div className="lesson-path">
          {lesson.masteryPath.map((step, index) => (
            <span key={step}>
              {index + 1}. {step}
            </span>
          ))}
        </div>
      )}

      <section className="lesson-grid">
        <Section title="Core Idea" tone="accent">
          <p>{overviewParagraphs[0]}</p>
          {overviewParagraphs[1] && <p>{overviewParagraphs[1]}</p>}
        </Section>

        <Section title="Why It Matters" tone="soft">
          {overviewParagraphs.slice(2, 4).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </Section>
      </section>

      <Section title="5W1H Concept Map">
        <div className="concept-map">
          {Object.entries(lesson.fiveWOneH).map(([key, value]) => (
            <div key={key}>
              <b>{key.toUpperCase()}</b>
              <p>{value}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Terminology">
        <div className="grid gap-3 md:grid-cols-2">
          {lesson.terminology.map((term) =>
            isTermEntry(term) ? (
              <div key={term.term} className="term-card">
                <h4>{term.term}</h4>
                <p><b>Definition:</b> {term.definition}</p>
                <p><b>Plain English:</b> {term.plainEnglish}</p>
                <p><b>Mnemonic:</b> {term.mnemonic}</p>
                <p><b>Example:</b> {term.example}</p>
                <p><b>Related:</b> {term.relatedConcepts.join(", ")}</p>
              </div>
            ) : (
              <p key={term}>{term}</p>
            )
          )}
        </div>
      </Section>

      <section className="lesson-grid">
        <Section title="Worked Examples" tone="soft">
          {lesson.workedExamples ? (
            <div className="space-y-3">
              {Object.entries(lesson.workedExamples).map(([key, value]) => (
                <p key={key}><b>{key}:</b> {value}</p>
              ))}
            </div>
          ) : (
            <List items={lesson.examples || []} />
          )}
        </Section>

        {lesson.scenarioAnalysis && (
          <Section title="Scenario Decision" tone="accent">
            <p><b>Scenario:</b> {lesson.scenarioAnalysis.scenario}</p>
            <p><b>Decision:</b> {lesson.scenarioAnalysis.decisionRequired}</p>
            <p><b>Consequence:</b> {lesson.scenarioAnalysis.consequences}</p>
            <p><b>Approach:</b> {lesson.scenarioAnalysis.recommendedApproach}</p>
          </Section>
        )}
      </section>

      <Section title="Critical Thinking Lab">
        <div className="prompt-grid">
          {lab.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      </Section>

      <section className="lesson-grid">
        <Section title="TOWS Analysis">
          {Object.entries(lesson.tows).map(([key, value]) => (
            Array.isArray(value) ? <p key={key}><b>{key}:</b> {value.join(", ")}</p> : <p key={key}><b>{key}:</b> {value}</p>
          ))}
        </Section>

        {lesson.commonMistakes && (
          <Section title="Common Mistakes">
            {Object.entries(lesson.commonMistakes).map(([key, value]) => (
              <div key={key} className="mb-3">
                <b>{key}</b>
                <List items={value} />
              </div>
            ))}
          </Section>
        )}
      </section>

      {history && (
        <Section title="Historical Context" tone="soft">
          <div className="grid gap-3 md:grid-cols-2">
            <p><b>Origins:</b> {history.origins}</p>
            <p><b>Evolution:</b> {history.evolution}</p>
            <p><b>Regulatory changes:</b> {history.regulatoryChanges}</p>
            <p><b>Exam relevance:</b> {history.cpaExamRelevance}</p>
          </div>
        </Section>
      )}

      {lesson.reinforcementLearning && (
        <Section title="Reinforcement Ladder" tone="accent">
          <div className="prompt-grid">
            {Object.entries(lesson.reinforcementLearning).map(([key, value]) => (
              <p key={key}><b>{key}:</b> {value}</p>
            ))}
          </div>
        </Section>
      )}

      <section className="lesson-grid">
        <Section title="Reflection">
          <List items={lesson.reflection} />
        </Section>

        <Section title="Quiz">
          <div className="space-y-3">
            {lesson.quiz.slice(0, 5).map((question) => (
              <div key={question.id} className="term-card">
                <p className="text-xs font-bold uppercase text-primary">{question.type || "Question"}</p>
                <p className="mt-1 font-semibold">{question.question}</p>
                <p className="mt-2"><b>Answer:</b> {question.answer}</p>
                <p><b>Explanation:</b> {question.explanation}</p>
              </div>
            ))}
          </div>
        </Section>
      </section>

      <button
        onClick={() => {
          analytics.completeLesson();
          user.addXP(25);
        }}
        className="mt-6 flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-bold text-white"
      >
        Mark Complete +25 XP <ArrowRight size={18} />
      </button>
    </article>
  );
}
