import { Link, useLocation } from "react-router-dom";
import { CheckCircle2, Circle } from "lucide-react";
import { learningStages } from "../utils/learningFlow";

interface LearningFlowProps {
  compact?: boolean;
}

export default function LearningFlow({ compact = false }: LearningFlowProps) {
  const { pathname } = useLocation();

  return (
    <div className={compact ? "space-y-2" : "learning-stepper"}>
      {learningStages.map((stage, index) => {
        const active = pathname === stage.route;
        return (
          <Link
            key={stage.id}
            to={stage.route}
            className={`flow-step ${active ? "flow-step-active" : ""} ${compact ? "flow-step-compact" : ""}`}
          >
            <span className="flex items-center gap-2">
              {active ? <CheckCircle2 size={16} /> : <Circle size={16} />}
              <b>{index + 1}. {stage.label}</b>
            </span>
            {!compact && <span className="mt-1 block text-xs leading-5 opacity-80">{stage.focus}</span>}
          </Link>
        );
      })}
    </div>
  );
}
