import { NavLink } from "react-router-dom";
import { BookOpen, BrainCircuit, FileQuestion, House, ShieldCheck, Target } from "lucide-react";

const links = [
  ["/", "Start", House],
  ["/academy", "Learn", BookOpen],
  ["/ai-coach", "AI", BrainCircuit],
  ["/test-master", "Practice", Target],
  ["/practice-exam", "Exam", FileQuestion],
  ["/war-room", "Ready", ShieldCheck],
] as const;

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 flex justify-around border-t border-slate-200 bg-white px-2 py-2 text-xs md:hidden dark:border-slate-800 dark:bg-slate-950">
      {links.map(([to, label, Icon]) => (
        <NavLink key={to} to={to} className={({ isActive }) => `mobile-link ${isActive ? "mobile-link-active" : ""}`}>
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
