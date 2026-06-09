import type { Lesson } from "../types/lesson";
import type { CaseStudy } from "../types/caseStudy";

export interface StudyItem {
  id: string;
  kind: "Lesson" | "Case";
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

export function buildStudyItems(lessons: Lesson[], cases: CaseStudy[]): StudyItem[] {
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
