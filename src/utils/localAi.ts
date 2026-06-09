import type { Lesson } from "../types/lesson";
import type { CaseStudy } from "../types/caseStudy";
import type { VocabularyTerm } from "../types/vocabulary";
import type { Question } from "../types/question";

export interface StudyItem {
  id: string;
  kind: "Lesson" | "Case" | "Recall" | "Simulation" | "Practice";
  title: string;
  subject: string;
  text: string;
  route: string;
}

export interface StudyMatch extends StudyItem {
  score: number;
  reason: string;
}

type FeaturePipeline = (text: string, options?: { pooling?: string; normalize?: boolean }) => Promise<{ data: ArrayLike<number> }>;

let extractorPromise: Promise<FeaturePipeline> | null = null;

const defaultPracticeTopics: StudyItem[] = [
  {
    id: "practice-aud-evidence",
    kind: "Practice",
    title: "Audit Evidence and Fraud Risk",
    subject: "AUD",
    text: "Audit evidence fraud risk journal entries revenue cutoff professional skepticism confirmations inquiry inspection recalculation.",
    route: "/test-master",
  },
  {
    id: "practice-far-revenue-leases",
    kind: "Practice",
    title: "Revenue Recognition and Lease Classification",
    subject: "FAR",
    text: "Revenue recognition performance obligations cutoff contract modification lease classification present value purchase option disclosure.",
    route: "/test-master",
  },
  {
    id: "practice-reg-basis",
    kind: "Practice",
    title: "Basis, Gain, and Entity Tax",
    subject: "REG",
    text: "Adjusted basis amount realized recognized gain liabilities boot entity formation tax planning documentation.",
    route: "/test-master",
  },
  {
    id: "practice-isc-controls",
    kind: "Practice",
    title: "Access Controls and Change Management",
    subject: "ISC",
    text: "Logical access privileged access shared accounts termination deprovisioning change management SOC readiness evidence.",
    route: "/test-master",
  },
];

interface SimulationItem {
  id: string;
  subject: string;
  title: string;
  skill: string;
  scenario: string;
  exhibits: string[];
  tasks: string[];
  hints?: string[];
  rubric?: string[];
  microLearning?: {
    plainEnglish: string;
    examTrap: string;
    decisionRule: string;
    memoryHook: string;
  };
}

export function buildStudyItems(
  lessons: Lesson[],
  cases: CaseStudy[],
  vocabulary: VocabularyTerm[] = [],
  simulations: SimulationItem[] = [],
  questions: Question[] = []
): StudyItem[] {
  const practiceTopics = questions.length ? Array.from(
    questions.reduce((map, question) => {
      const key = `${question.subject}:${question.topic || question.blueprintMapping?.group || question.type}`;
      if (!map.has(key)) map.set(key, question);
      return map;
    }, new Map<string, Question>()).values()
  ).slice(0, 80) : [];

  return [
    ...lessons.slice(0, 84).map((lesson) => ({
      id: lesson.id,
      kind: "Lesson" as const,
      title: lesson.title.replace(/ Mastery$/, ""),
      subject: lesson.subject,
      text: `${lesson.title}. ${lesson.subject}. ${lesson.overview} ${lesson.scenarioAnalysis?.scenario || ""}`,
      route: "/academy",
    })),
    ...cases.map((study) => ({
      id: study.id,
      kind: "Case" as const,
      title: study.title,
      subject: study.company,
      text: `${study.title}. ${study.category}. ${study.summary} ${study.rootCause || ""} ${study.failureAnalysis.join(" ")}`,
      route: "/cases",
    })),
    ...vocabulary.map((term) => ({
      id: term.id,
      kind: "Recall" as const,
      title: term.term,
      subject: term.subject,
      text: `${term.term}. ${term.definition} ${term.simpleDefinition} ${term.example} ${term.mnemonic} ${term.microLearning?.whyItMatters || ""} ${term.microLearning?.examTrap || ""}`,
      route: "/vocabulary",
    })),
    ...simulations.map((simulation) => ({
      id: simulation.id,
      kind: "Simulation" as const,
      title: simulation.title,
      subject: simulation.subject,
      text: `${simulation.title}. ${simulation.skill}. ${simulation.scenario} ${simulation.exhibits.join(" ")} ${simulation.tasks.join(" ")} ${simulation.microLearning?.plainEnglish || ""} ${simulation.microLearning?.examTrap || ""} ${simulation.microLearning?.decisionRule || ""}`,
      route: "/simulations",
    })),
    ...(practiceTopics.length ? practiceTopics.map((question) => ({
      id: question.id,
      kind: "Practice" as const,
      title: question.topic || question.blueprintMapping?.group || `${question.subject} ${question.type}`,
      subject: question.subject,
      text: `${question.subject}. ${question.topic || ""}. ${question.type}. ${question.difficulty}. ${question.question} ${question.explanation} ${question.examTip} ${question.memoryHook}`,
      route: "/test-master",
    })) : defaultPracticeTopics),
  ];
}

export async function getFeatureExtractor() {
  if (!extractorPromise) {
    extractorPromise = import("@huggingface/transformers").then(async ({ pipeline }) => {
      return pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2") as Promise<FeaturePipeline>;
    });
  }
  return extractorPromise;
}

function cosineSimilarity(a: ArrayLike<number>, b: ArrayLike<number>) {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let index = 0; index < a.length; index += 1) {
    dot += Number(a[index]) * Number(b[index]);
    normA += Number(a[index]) ** 2;
    normB += Number(b[index]) ** 2;
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB) || 1);
}

export async function semanticStudySearch(query: string, items: StudyItem[], limit = 6): Promise<StudyMatch[]> {
  const extractor = await getFeatureExtractor();
  const queryVector = await extractor(query, { pooling: "mean", normalize: true });
  const candidates = items.slice(0, 80);
  const scored: StudyMatch[] = [];

  for (const item of candidates) {
    const vector = await extractor(item.text.slice(0, 1200), { pooling: "mean", normalize: true });
    scored.push({
      ...item,
      score: cosineSimilarity(queryVector.data, vector.data),
      reason: "Semantic match from local browser embeddings.",
    });
  }

  return scored.sort((a, b) => b.score - a.score).slice(0, limit);
}

export function keywordStudySearch(query: string, items: StudyItem[], limit = 6): StudyMatch[] {
  const tokens = query.toLowerCase().split(/\W+/).filter((token) => token.length > 2);
  return items
    .map((item) => {
      const haystack = `${item.title} ${item.subject} ${item.text}`.toLowerCase();
      const hits = tokens.filter((token) => haystack.includes(token));
      return {
        ...item,
        score: hits.length / Math.max(tokens.length, 1),
        reason: hits.length ? `Matched: ${hits.slice(0, 4).join(", ")}` : "General study recommendation.",
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
