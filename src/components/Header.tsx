import { Moon, Search, Sun } from "lucide-react";
import { useUserStore } from "../store/userStore";
import { useThemeStore } from "../store/themeStore";
import { useAnalyticsStore } from "../store/analyticsStore";
import { getAccuracy } from "../utils/learningFlow";

export default function Header() {
  const { profile } = useUserStore();
  const analytics = useAnalyticsStore();
  const { theme, toggleTheme } = useThemeStore();
  const accuracy = getAccuracy(analytics);

  return (
    <header className="app-header">
      <div className="header-search" role="search">
        <Search size={18} />
        <span>CPA Study Cockpit / De-Omega-Point Project / Search lessons, terms, questions...</span>
      </div>

      <div className="header-status">
        <div className="status-pill">
          <b>Level {profile.level}</b>
          <span>{profile.targetDiscipline}</span>
        </div>
        <div className="status-pill">
          <b>{accuracy}%</b>
          <span>Accuracy</span>
        </div>
        <button onClick={toggleTheme} className="icon-button" aria-label="Toggle theme">
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          <span>{theme === "dark" ? "Light" : "Dark"}</span>
        </button>
      </div>
    </header>
  );
}
