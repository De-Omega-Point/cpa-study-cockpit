export interface VocabularyTerm {
  id: string;
  subject: "FAR" | "AUD" | "REG" | "BAR" | "ISC" | "TCP" | "HISTORY" | "GENERAL";
  term: string;
  definition: string;
  simpleDefinition: string;
  example: string;
  mnemonic: string;
  microLearning?: {
    whyItMatters: string;
    examTrap: string;
    reinforcementPrompt: string;
  };
  relatedTerms: string[];
  relatedConcepts?: string[];
  difficulty: "easy" | "medium" | "hard";
  quizQuestion?: {
    question: string;
    options?: string[];
    answer: string;
    explanation: string;
  };
}
