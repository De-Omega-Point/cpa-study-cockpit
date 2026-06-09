import { ReactNode } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import MobileNav from "../components/MobileNav";
import { useThemeStore } from "../store/themeStore";

export default function MainLayout({ children }: { children: ReactNode }) {
  const { theme } = useThemeStore();

  return (
    <div className={`min-h-screen ${theme === "dark" ? "dark dark-shell" : "bg-slate-100"}`}>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Header />
          <main id="main-content" className="flex-1 overflow-auto" tabIndex={-1}>{children}</main>
          <MobileNav />
        </div>
      </div>
    </div>
  );
}
