import { useState } from "react";
import initial from "../data/illinois-pathway.json";
import { loadData, saveData } from "../utils/localStorage";
import type { TrackerStep } from "../types/tracker";

const KEY = "cpa-pathway-steps-v2";

function List({ items = [] }: { items?: string[] }) {
  return (
    <ul className="list-disc space-y-1 pl-6">
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  );
}

export default function ProgressTracker() {
  const [steps, setSteps] = useState<TrackerStep[]>(() => loadData<TrackerStep[]>(KEY) || (initial as TrackerStep[]));
  const toggle = (id: string) => {
    const next = steps.map((step) => (step.id === id ? { ...step, completed: !step.completed } : step));
    setSteps(next);
    saveData(KEY, next);
  };
  const pct = Math.round((steps.filter((step) => step.completed).length / steps.length) * 100);

  return (
    <div className="card">
      <h2 className="section-title">Illinois CPA Tracker</h2>
      <p className="mt-2">Progress: {pct}%</p>
      <div className="mt-4 h-3 rounded bg-slate-200">
        <div className="h-3 rounded bg-primary" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-6 space-y-3">
        {steps.map((step) => (
          <article key={step.id} className="rounded-lg border p-4">
            <button onClick={() => toggle(step.id)} className="flex w-full items-start gap-3 text-left">
              <span className={step.completed ? "text-green-600" : "text-slate-400"}>{step.completed ? "●" : "○"}</span>
              <span>
                <b>{step.label}</b>
                <p className="text-sm text-slate-500">{step.description}</p>
              </span>
            </button>
            <div className="mt-4 grid gap-4 text-sm md:grid-cols-2">
              {step.overview && <p className="md:col-span-2">{step.overview}</p>}
              <section>
                <h3 className="font-bold">Requirements</h3>
                <List items={step.requirements} />
              </section>
              <section>
                <h3 className="font-bold">Documents</h3>
                <List items={step.documents} />
              </section>
              <section>
                <h3 className="font-bold">Costs</h3>
                <List items={step.costs} />
              </section>
              <section>
                <h3 className="font-bold">Common Mistakes</h3>
                <List items={step.commonMistakes} />
              </section>
              <section>
                <h3 className="font-bold">Success Tips</h3>
                <List items={step.successTips || step.tips} />
              </section>
              {step.timeline && (
                <section>
                  <h3 className="font-bold">Timeline</h3>
                  <p>{step.timeline}</p>
                </section>
              )}
              {step.faq && (
                <section className="md:col-span-2">
                  <h3 className="font-bold">FAQ</h3>
                  <div className="mt-2 grid gap-2 md:grid-cols-2">
                    {step.faq.map((item) => (
                      <p key={item.question}><b>{item.question}</b><br />{item.answer}</p>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
