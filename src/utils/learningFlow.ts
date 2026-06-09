import type { Analytics } from "../types/analytics";
import type { UserProfile } from "../types/user";

export const subjectSequence = ["FAR", "AUD", "REG", "BAR", "ISC", "TCP", "HISTORY"] as const;

export const learningStages = [
  {
    id: "orient",
    label: "Orient",
    route: "/",
    focus: "Set the mission, target discipline, and daily workload.",
  },
  {
    id: "learn",
    label: "Learn",
    route: "/academy",
    focus: "Study one mastery module at a time.",
  },
  {
    id: "recall",
    label: "Recall",
    route: "/vocabulary",
    focus: "Build vocabulary and memory hooks.",
  },
  {
    id: "practice",
    label: "Practice",
    route: "/test-master",
    focus: "Answer mixed questions with explanations.",
  },
  {
    id: "judge",
    label: "Judge",
    route: "/cases",
    focus: "Apply professional judgment to messy cases.",
  },
  {
    id: "simulate",
    label: "Simulate",
    route: "/war-room",
    focus: "Run mock exams and diagnose weak areas.",
  },
  {
    id: "license",
    label: "License",
    route: "/tracker",
    focus: "Track Illinois requirements and documents.",
  },
] as const;

export function getAccuracy(analytics: Pick<Analytics, "questionsAnswered" | "correctAnswers">) {
  return analytics.questionsAnswered ? Math.round((analytics.correctAnswers / analytics.questionsAnswered) * 100) : 0;
}

export function getCurrentSubject(profile: UserProfile, analytics: Analytics) {
  if (analytics.lessonsCompleted < 12) return "FAR";
  if (analytics.lessonsCompleted < 24) return "AUD";
  if (analytics.lessonsCompleted < 36) return "REG";
  return profile.targetDiscipline || "TCP";
}

export function getNextAction(profile: UserProfile, analytics: Analytics) {
  const accuracy = getAccuracy(analytics);
  const subject = getCurrentSubject(profile, analytics);

  if (analytics.lessonsCompleted < 3) {
    return {
      label: `Start ${subject} foundations`,
      route: "/academy",
      reason: "Begin with concept clarity before practice volume.",
    };
  }

  if (analytics.vocabularyReviewed < analytics.lessonsCompleted * 5) {
    return {
      label: "Reinforce vocabulary",
      route: "/vocabulary",
      reason: "Memory hooks make later questions easier to decode.",
    };
  }

  if (analytics.questionsAnswered < analytics.lessonsCompleted * 8 || accuracy < 70) {
    return {
      label: "Run guided practice",
      route: "/test-master",
      reason: "Practice turns reading into exam behavior.",
    };
  }

  if (analytics.caseStudiesCompleted < Math.max(1, Math.floor(analytics.lessonsCompleted / 4))) {
    return {
      label: "Work a judgment case",
      route: "/cases",
      reason: "Cases train professional judgment and explanation.",
    };
  }

  return {
    label: "Check readiness",
    route: "/war-room",
    reason: "Use mock exams to decide the next weak-area cycle.",
  };
}
