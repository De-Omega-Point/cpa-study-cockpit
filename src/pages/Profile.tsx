import MainLayout from "../layouts/MainLayout";
import LearningFlow from "../components/LearningFlow";
import { useUserStore } from "../store/userStore";

export default function Profile() {
  const { profile, updateProfile } = useUserStore();

  return (
    <MainLayout>
      <div className="page-container space-y-6">
        <section className="page-heading">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-primary">Setup</p>
            <h1 className="section-title">Candidate Profile</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-200">Your target discipline and weekly study capacity shape the recommended learning cycle.</p>
          </div>
        </section>

        <LearningFlow />

        <section className="grid gap-4 lg:grid-cols-[1fr_360px]">
          <div className="card grid gap-4 md:grid-cols-2">
            <label>
              Name
              <input className="mt-1 w-full" value={profile.name} onChange={(event) => updateProfile({ name: event.target.value })} />
            </label>
            <label>
              Target Discipline
              <select className="mt-1 w-full" value={profile.targetDiscipline} onChange={(event) => updateProfile({ targetDiscipline: event.target.value as typeof profile.targetDiscipline })}>
                <option>BAR</option>
                <option>ISC</option>
                <option>TCP</option>
              </select>
            </label>
            <label>
              Target Exam Date
              <input type="date" className="mt-1 w-full" value={profile.targetExamDate} onChange={(event) => updateProfile({ targetExamDate: event.target.value })} />
            </label>
            <label>
              Study Hours Weekly
              <input type="number" min={1} className="mt-1 w-full" value={profile.studyHoursWeekly} onChange={(event) => updateProfile({ studyHoursWeekly: Number(event.target.value) })} />
            </label>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold">Weekly Rhythm</h2>
            <div className="mt-4 space-y-3 text-sm">
              <p className="rounded-lg bg-slate-50 p-3 dark:bg-slate-900"><b>40%</b> Learn and annotate mastery modules.</p>
              <p className="rounded-lg bg-slate-50 p-3 dark:bg-slate-900"><b>20%</b> Vocabulary recall and memory hooks.</p>
              <p className="rounded-lg bg-slate-50 p-3 dark:bg-slate-900"><b>30%</b> TEST MASTER practice and explanations.</p>
              <p className="rounded-lg bg-slate-50 p-3 dark:bg-slate-900"><b>10%</b> Cases, mocks, and Illinois tracker updates.</p>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
