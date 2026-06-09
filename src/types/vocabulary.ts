export interface VocabularyTerm {
  id: string;
  subject: "FAR" | "AUD" | "REG" | "BAR" | "ISC" | "TCP" | "HISTORY" | "GENERAL";
  term: string;
  definition: string;
  simpleDefinition: string;
  example: string;
  mnemonic: string;
  relatedTerms: string[];
  relatedConcepts?: string[];
  difficulty: "easy" | "medium" | "hard";
  quizQuestion?: {
    question: string;
    answer: string;
    explanation: string;
  };
}
