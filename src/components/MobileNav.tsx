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
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
      {links.map(([to, label, Icon]) => (
        <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => `mobile-link ${isActive ? "mobile-link-active" : ""}`}>
          <Icon size={18} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
