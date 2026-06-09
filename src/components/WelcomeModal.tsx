import { FormEvent, useState } from "react";
import { Sparkles } from "lucide-react";
import { useUserStore } from "../store/userStore";

export default function WelcomeModal() {
  const { profile, updateProfile } = useUserStore();
  const [name, setName] = useState(profile.name);
  const shouldShow = !profile.name.trim();

  if (!shouldShow) return null;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) return;
    updateProfile({ name: cleanName });
  };

  return (
    <div className="welcome-overlay" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
      <form className="welcome-card" onSubmit={submit}>
        <span className="brand-mark">
          <Sparkles size={24} />
        </span>
        <p className="text-sm font-bold uppercase tracking-wide text-primary">CPA Study Cockpit / De-Omega-Point Project</p>
        <h1 id="welcome-title" className="mt-2 text-3xl font-extrabold">Welcome. Let’s personalize your study path.</h1>
        <p className="mt-3 text-slate-600">
          What should we call you while guiding your CPA mastery flow?
        </p>
        <label className="mt-5 block">
          Your name
          <input
            autoFocus
            className="mt-2 w-full"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter your name"
          />
        </label>
        <button className="mt-5 w-full rounded-lg bg-primary px-5 py-3 font-bold text-white" disabled={!name.trim()}>
          Start My Path
        </button>
      </form>
    </div>
  );
}
