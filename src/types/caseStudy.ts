export interface TimelineEvent {
  year: string;
  event: string;
}

export interface CaseQuestion {
  question: string;
  answer: string;
  explanation?: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  company: string;
  category: string;
  background?: string;
  summary: string;
  timeline: TimelineEvent[];
  rootCause?: string;
  failureAnalysis: string[];
  ethicsAnalysis?: string;
  auditAnalysis?: string;
  tows: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  lessons?: string[];
  lessonsLearned?: string[];
  examRelevance?: string[];
  cpaExamRelevance?: string[];
  criticalThinkingQuestions?: string[];
  quiz: CaseQuestion[];
  sources?: Array<{
    label: string;
    url: string;
  }>;
}
