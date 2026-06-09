import { useState } from "react";
import { VocabularyTerm } from "../types/vocabulary";
import { useAnalyticsStore } from "../store/analyticsStore";
import { useUserStore } from "../store/userStore";

export default function VocabularyCard({ term }: { term: VocabularyTerm }) {
  const [show, setShow] = useState(false);
  const analytics = useAnalyticsStore();
  const user = useUserStore();

  return (
    <div className="card">
      <div className="flex flex-wrap justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase text-primary">{term.subject} / {term.difficulty}</p>
          <h3 className="text-xl font-bold">{term.term}</h3>
        </div>
        <button
          onClick={() => {
            setShow(!show);
            if (!show) {
              analytics.reviewVocabulary();
              user.addXP(5);
            }
          }}
          className="font-semibold text-primary"
        >
          {show ? "Hide" : "Reveal +5 XP"}
        </button>
      </div>
      <p className="mt-2">{term.definition}</p>
      {show && (
        <div className="mt-4 space-y-2 text-sm leading-6">
          <p><b>Plain English:</b> {term.simpleDefinition}</p>
          <p><b>Example:</b> {term.example}</p>
          <p><b>Mnemonic:</b> {term.mnemonic}</p>
          <p><b>Related terms:</b> {term.relatedTerms.join(", ")}</p>
          {term.relatedConcepts && <p><b>Related concepts:</b> {term.relatedConcepts.join(", ")}</p>}
          {term.quizQuestion && (
            <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
              <p className="font-bold">{term.quizQuestion.question}</p>
              <p><b>Answer:</b> {term.quizQuestion.answer}</p>
              <p><b>Explanation:</b> {term.quizQuestion.explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
