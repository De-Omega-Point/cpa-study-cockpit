export interface QuizQuestion {
  id: string;
  type?: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  examTip?: string;
  memoryHook?: string;
}

export interface TerminologyEntry {
  term: string;
  definition: string;
  plainEnglish: string;
  mnemonic: string;
  example: string;
  relatedConcepts: string[];
  examRelevance: string;
}

export interface Lesson {
  id: string;
  subject: string;
  discipline?: string;
  chapter: string;
  title: string;
  masteryPath?: string[];
  overview: string;
  historicalContext:
    | string
    | {
        origins: string;
        evolution: string;
        milestones: string[];
        regulatoryChanges: string;
        cpaExamRelevance: string;
      };
  terminology: Array<string | TerminologyEntry>;
  examples?: string[];
  workedExamples?: {
    basic: string;
    intermediate: string;
    advanced: string;
    cpaExam: string;
    realBusiness: string;
  };
  criticalThinking?: string[];
  criticalThinkingLab?: string[];
  scenarioAnalysis?: {
    scenario: string;
    decisionRequired: string;
    consequences: string;
    alternatives: string[];
    recommendedApproach: string;
  };
  reflection: string[];
  quiz: QuizQuestion[];
  fiveWOneH: {
    what: string;
    why: string;
    who: string;
    when: string;
    where: string;
    how: string;
  };
  tows: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
    cpaExamRelevance?: string;
  };
  commonMistakes?: {
    beginner: string[];
    intermediate: string[];
    cpaExamTraps: string[];
    realWorld: string[];
  };
  reinforcementLearning?: {
    level1Recall: string;
    level2Application: string;
    level3Analysis: string;
    level4ProfessionalJudgment: string;
  };
  aiTutorContent?: Record<string, string>;
}
