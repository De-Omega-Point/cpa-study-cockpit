import { NavLink } from "react-router-dom";
import {
  BookOpen,
  Brain,
  BrainCircuit,
  Briefcase,
  ClipboardCheck,
  FileQuestion,
  GraduationCap,
  Home,
  LayoutDashboard,
  Route,
  ShieldCheck,
  Sparkles,
  Target,
  User,
} from "lucide-react";

const groups = [
  {
    label: "Study Flow",
    links: [
      ["/", "Welcome", Home],
      ["/dashboard", "Cockpit", LayoutDashboard],
      ["/profile", "Candidate Setup", User],
      ["/academy", "Guided Lessons", BookOpen],
      ["/deep-dive", "Deep Dive", GraduationCap],
      ["/ai-coach", "AI Coach", BrainCircuit],
      ["/vocabulary", "Recall Lab", Brain],
    ],
  },
  {
    label: "Practice",
    links: [
      ["/test-master", "Question Drill", Target],
      ["/practice-exam", "Practice Exam", FileQuestion],
      ["/simulations", "Simulation Lab", ClipboardCheck],
      ["/cases", "Case Judgment", Briefcase],
    ],
  },
  {
    label: "Readiness",
    links: [
      ["/war-room", "War Room", ShieldCheck],
      ["/tracker", "Illinois License", Route],
    ],
  },
] as const;

export default function Sidebar() {
  return (
    <aside className="app-sidebar">
      <div className="brand-panel">
        <span className="brand-mark"><Sparkles size={21} /></span>
        <div>
          <h1>CPA Study Cockpit</h1>
          <p>De-Omega-Point Project</p>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        {groups.map((group) => (
          <section key={group.label} className="nav-section">
            <h2>{group.label}</h2>
            <div className="space-y-1">
              {group.links.map(([to, label, Icon]) => (
                <NavLink key={to} to={to} className={({ isActive }) => `sidebar-link ${isActive ? "sidebar-link-active" : ""}`}>
                  <Icon size={19} />
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
          </section>
        ))}
      </nav>
    </aside>
  );
}
