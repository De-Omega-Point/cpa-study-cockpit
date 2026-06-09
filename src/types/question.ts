export type QuestionDifficulty = "easy" | "medium" | "hard";
export type QuestionType = "mcq" | "trueFalse" | "matching" | "dragDrop" | "scenario" | "caseStudy" | "calculation" | "simulation";
export type QuestionSubject = "FAR" | "AUD" | "REG" | "BAR" | "ISC" | "TCP" | "HISTORY";

export interface Question {
  id: string;
  subject: QuestionSubject;
  difficulty: QuestionDifficulty;
  type: QuestionType;
  topic?: string;
  blueprintMapping?: {
    area: string;
    group: string;
    skill: string;
  };
  question: string;
  options?: string[];
  answer: string;
  explanation: string;
  examTip: string;
  memoryHook: string;
}
