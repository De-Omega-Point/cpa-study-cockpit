import MainLayout from "../layouts/MainLayout";
import LearningFlow from "../components/LearningFlow";
import ProgressTracker from "../components/ProgressTracker";

export default function IllinoisTracker() {
  return (
    <MainLayout>
      <div className="page-container space-y-6">
        <section className="page-heading">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-primary">Step 7 / License</p>
            <h1 className="section-title">Illinois CPA Tracker</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-200">Convert exam progress into licensure progress with documents, deadlines, and common mistakes.</p>
          </div>
        </section>
        <LearningFlow />
        <ProgressTracker />
      </div>
    </MainLayout>
  );
}
