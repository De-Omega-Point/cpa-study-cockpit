import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Brain,
  BrainCircuit,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardCheck,
  FileQuestion,
  GraduationCap,
  MonitorCheck,
  ShieldCheck,
  Target,
} from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import StatCard from "../components/StatCard";
import { useUserStore } from "../store/userStore";
import { useAnalyticsStore } from "../store/analyticsStore";
import { rankFromLevel } from "../utils/xpEngine";
import { getAccuracy, getCurrentSubject, getNextAction } from "../utils/learningFlow";
import { contentCatalog } from "../utils/contentCatalog";

const learningPath = [
  { label: "Learn", route: "/academy", icon: BookOpen, copy: "One guided module" },
  { label: "Deep Dive", route: "/deep-dive", icon: GraduationCap, copy: "Explain and transfer" },
  { label: "AI Coach", route: "/ai-coach", icon: BrainCircuit, copy: "Find your path" },
  { label: "Recall", route: "/vocabulary", icon: Brain, copy: "Memory hooks" },
  { label: "Practice", route: "/test-master", icon: Target, copy: "Question drill" },
] as const;

const advancedWorkflows = [
  { icon: FileQuestion, title: "Practice Exam", route: "/practice-exam", copy: "Build 25, 50, 100, or 200-question scored tests." },
  { icon: BriefcaseBusiness, title: "Case Judgment", route: "/cases", copy: "Study real accounting, audit, tax, and ethics failures." },
  { icon: ShieldCheck, title: "War Room", route: "/war-room", copy: "Review readiness, weak areas, and mock exam recommendations." },
] as const;

export default function Dashboard() {
  const { profile } = useUserStore();
  const analytics = useAnalyticsStore();
  const accuracy = getAccuracy(analytics);
  const currentSubject = getCurrentSubject(profile, analytics);
  const nextAction = getNextAction(profile, analytics);
  const readiness = analytics.readiness || Math.min(100, Math.round((analytics.lessonsCompleted / 84) * 35 + accuracy * .35));

  return (
    <MainLayout>
      <div className="page-container space-y-6">
        <section className="learning-hero">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-primary">Cockpit / {currentSubject} focus</p>
            <h1 className="mt-2 text-3xl font-extrabold md:text-5xl">{profile.name ? `${profile.name}, know what to do next.` : "Know what to do next."}</h1>
            <p className="mt-4 max-w-3xl text-slate-600 dark:text-slate-200">
              CPA Study Cockpit keeps daily learning, recall, practice, simulations, and Illinois licensure progress in one visible flow.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to={nextAction.route} className="rounded-lg bg-primary px-5 py-3 font-bold text-white">
                {nextAction.label}
              </Link>
              <Link to="/practice-exam" className="rounded-lg border border-slate-300 px-5 py-3 font-bold">
                Start Practice Exam
              </Link>
            </div>
          </div>

          <div className="card bg-slate-50 dark:bg-slate-900">
            <p className="text-sm font-bold uppercase tracking-wide text-primary">Recommended next action</p>
            <h2 className="mt-2 text-2xl font-extrabold">{nextAction.label}</h2>
            <p className="mt-2">{nextAction.reason}</p>
            <Link to={nextAction.route} className="mt-5 flex items-center justify-between rounded-lg bg-secondary px-4 py-3 font-bold text-white">
              Continue <ArrowRight size={20} />
            </Link>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <StatCard title="Readiness" value={`${readiness}%`} subtitle="Estimated from progress" />
          <StatCard title="Accuracy" value={`${accuracy}%`} subtitle={`${analytics.correctAnswers}/${analytics.questionsAnswered} correct`} />
          <StatCard title="XP" value={profile.xp} subtitle={rankFromLevel(profile.level)} />
          <StatCard title="Weekly Time" value={`${profile.studyHoursWeekly}h`} subtitle={`${profile.targetDiscipline} discipline`} />
        </section>

        <section className="grid gap-4 md:grid-cols-6">
          <StatCard title="Lessons" value={contentCatalog.lessons} subtitle="deep modules" />
          <StatCard title="Questions" value={contentCatalog.questions} subtitle="practice bank" />
          <StatCard title="Terms" value={contentCatalog.vocabulary} subtitle="recall library" />
          <StatCard title="Cases" value={contentCatalog.caseStudies} subtitle="judgment lab" />
          <StatCard title="Sims" value={contentCatalog.simulations} subtitle="feedback tasks" />
          <StatCard title="Mocks" value={contentCatalog.mockExams} subtitle="readiness sets" />
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.35fr_.65fr]">
          <div className="card">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold">Today’s Study Path</h2>
                <p className="mt-1 text-slate-600 dark:text-slate-200">Follow this order to reduce decision fatigue.</p>
              </div>
              <CheckCircle2 className="text-primary" size={28} />
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-5">
              {learningPath.map(({ label, route, icon: Icon, copy }, index) => (
                <Link key={route} to={route} className="mode-card">
                  <span className="rounded-lg bg-emerald-50 p-2 text-primary"><Icon size={20} /></span>
                  <b>{index + 1}. {label}</b>
                  <small>{copy}</small>
                </Link>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold">Progress Snapshot</h2>
            <div className="mt-4 space-y-3">
              <div className="roadmap-row roadmap-row-active">
                <span>{analytics.lessonsCompleted}</span>
                <b>Lessons completed</b>
                <small>of 84 modules</small>
              </div>
              <div className="roadmap-row">
                <span>{analytics.vocabularyReviewed}</span>
                <b>Recall reps</b>
                <small>vocabulary reveals</small>
              </div>
              <div className="roadmap-row">
                <span>{analytics.mockExamsCompleted}</span>
                <b>Simulations recorded</b>
                <small>mock and lab attempts</small>
              </div>
            </div>
          </div>
        </section>

        <section className="card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold">Advanced Workflows</h2>
              <p className="mt-1 text-slate-600 dark:text-slate-200">Use these when you are ready to diagnose, test, or apply judgment.</p>
            </div>
            <ClipboardCheck className="text-primary" size={28} />
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {advancedWorkflows.map(({ icon: Icon, title, route, copy }) => (
              <Link key={route} to={route} className="mode-card">
                <Icon size={22} />
                <b>{title}</b>
                <small>{copy}</small>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
