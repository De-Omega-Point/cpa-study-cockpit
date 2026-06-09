export interface TrackerStep {
  id: string;
  label: string;
  description: string;
  completed: boolean;
  tips?: string[];
  overview?: string;
  requirements?: string[];
  costs?: string[];
  documents?: string[];
  commonMistakes?: string[];
  successTips?: string[];
  timeline?: string;
  faq?: Array<{
    question: string;
    answer: string;
  }>;
}
