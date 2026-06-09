import { Component, ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen bg-slate-100 p-6 text-slate-950">
        <div className="mx-auto mt-16 max-w-xl rounded-2xl border border-slate-300 bg-white p-6 shadow-lg">
          <AlertTriangle className="text-red-600" size={34} />
          <h1 className="mt-4 text-3xl font-extrabold">Something needs a quick reset.</h1>
          <p className="mt-3 text-slate-600">
            CPA Study Cockpit hit a runtime issue. Refreshing usually restores the current De-Omega-Point Project learning flow.
          </p>
          <button
            className="mt-5 flex items-center gap-2 rounded-lg bg-slate-950 px-5 py-3 font-bold text-white"
            onClick={() => window.location.reload()}
          >
            <RotateCcw size={18} />
            Refresh App
          </button>
        </div>
      </div>
    );
  }
}
