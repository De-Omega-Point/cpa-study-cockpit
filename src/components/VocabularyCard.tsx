import { useState } from "react";
import { Brain, CheckCircle2, Eye, RotateCcw, XCircle } from "lucide-react";
import { VocabularyTerm } from "../types/vocabulary";
import { useAnalyticsStore } from "../store/analyticsStore";
import { useUserStore } from "../store/userStore";

const confidenceOptions = [
  { label: "Again", xp: 2, copy: "Needs another rep soon." },
  { label: "Almost", xp: 4, copy: "Close, but still fragile." },
  { label: "Got it", xp: 8, copy: "Strong enough to move forward." },
] as const;

export default function VocabularyCard({ term }: { term: VocabularyTerm }) {
  const [show, setShow] = useState(false);
  const [prediction, setPrediction] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [confidence, setConfidence] = useState("");
  const [creditedReveal, setCreditedReveal] = useState(false);
  const analytics = useAnalyticsStore();
  const user = useUserStore();
  const quizOptions = term.quizQuestion?.options || [];
  const isCorrect = selectedAnswer === term.quizQuestion?.answer;

  const reveal = () => {
    setShow(true);
    if (!creditedReveal) {
      analytics.reviewVocabulary();
      user.addXP(5);
      setCreditedReveal(true);
    }
  };

  const reset = () => {
    setShow(false);
    setPrediction("");
    setSelectedAnswer("");
    setConfidence("");
    setCreditedReveal(false);
  };

  return (
    <div className="card">
      <div className="flex flex-wrap justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase text-primary">{term.subject} / {term.difficulty}</p>
          <h3 className="text-xl font-bold">{term.term}</h3>
        </div>
        <button
          onClick={() => {
            if (show) setShow(false);
            else reveal();
          }}
          className="icon-button"
        >
          <Eye size={18} /> {show ? "Hide" : "Reveal +5 XP"}
        </button>
      </div>

      <div className="mt-4 rounded-lg border border-slate-200 p-4 dark:border-slate-700">
        <label htmlFor={`predict-${term.id}`} className="font-bold">Active recall before reveal</label>
        <p className="mt-1 text-sm text-slate-500">Write what this term means from memory, then reveal and compare.</p>
        <textarea
          id={`predict-${term.id}`}
          className="mt-3 min-h-24 w-full"
          value={prediction}
          onChange={(event) => setPrediction(event.target.value)}
          placeholder={`Explain ${term.term} in your own words...`}
        />
      </div>

      {show && (
        <div className="mt-4 space-y-4 text-sm leading-6">
          <section className="lesson-section lesson-section-soft m-0">
            <h3 className="flex items-center gap-2"><Brain size={18} /> Micro-Learning</h3>
            <p className="mt-2"><b>Definition:</b> {term.definition}</p>
            <p><b>Plain English:</b> {term.simpleDefinition}</p>
            <p><b>Example:</b> {term.example}</p>
            <p><b>Memory hook:</b> {term.mnemonic}</p>
            {term.microLearning && (
              <div className="prompt-grid mt-3">
                <p><b>Why it matters:</b> {term.microLearning.whyItMatters}</p>
                <p><b>Exam trap:</b> {term.microLearning.examTrap}</p>
                <p><b>Reinforcement:</b> {term.microLearning.reinforcementPrompt}</p>
                <p><b>Connect:</b> {term.relatedTerms.join(", ")}</p>
              </div>
            )}
          </section>

          {term.quizQuestion && (
            <section className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
              <p className="font-bold">Check your understanding</p>
              <p className="mt-1">{term.quizQuestion.question}</p>
              {quizOptions.length > 0 ? (
                <div className="mt-3 grid gap-2">
                  {quizOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setSelectedAnswer(option);
                        if (option === term.quizQuestion?.answer) user.addXP(5);
                      }}
                      className={`answer-choice ${selectedAnswer === option ? "answer-choice-active" : ""}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="mt-2"><b>Answer:</b> {term.quizQuestion.answer}</p>
              )}
              {selectedAnswer && (
                <div className={`mt-3 rounded-lg p-3 ${isCorrect ? "bg-emerald-50 text-emerald-900" : "bg-amber-50 text-amber-950"}`}>
                  <b className="flex items-center gap-2">
                    {isCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                    {isCorrect ? "Correct" : `Review: ${term.quizQuestion.answer}`}
                  </b>
                  <p className="mt-1">{term.quizQuestion.explanation}</p>
                </div>
              )}
            </section>
          )}

          <section className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
            <p className="font-bold">Confidence grade</p>
            <p className="mt-1 text-slate-500">Choose honestly. This is how reinforcement learning works: weak terms come back sooner.</p>
            <div className="mt-3 grid gap-2 md:grid-cols-3">
              {confidenceOptions.map((option) => (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => {
                    setConfidence(option.label);
                    user.addXP(option.xp);
                  }}
                  className={`mode-card ${confidence === option.label ? "answer-choice-active" : ""}`}
                >
                  <b>{option.label}</b>
                  <small>{option.copy} +{option.xp} XP</small>
                </button>
              ))}
            </div>
          </section>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p><b>Related concepts:</b> {term.relatedConcepts?.join(", ") || "Professional judgment"}</p>
            <button type="button" onClick={reset} className="icon-button">
              <RotateCcw size={18} /> Reset rep
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
