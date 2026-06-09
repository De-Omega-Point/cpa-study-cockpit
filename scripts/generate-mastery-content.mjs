import { writeFileSync } from "node:fs";
import { join } from "node:path";

const outDir = join(process.cwd(), "src", "data");

const subjects = {
  FAR: {
    name: "Financial Accounting and Reporting",
    topics: [
      "Conceptual Framework",
      "Financial Statements",
      "Revenue Recognition",
      "Leases",
      "Bonds",
      "Cash Flows",
      "Governmental Accounting",
      "Not-for-Profit Reporting",
      "Consolidations",
      "Accounting Changes",
      "Inventory",
      "Income Taxes",
    ],
    lens: "measurement, recognition, presentation, and disclosure",
  },
  AUD: {
    name: "Auditing and Attestation",
    topics: [
      "Ethics and Independence",
      "Risk Assessment",
      "Internal Control",
      "Audit Evidence",
      "Sampling",
      "Audit Reports",
      "SSARS Engagements",
      "SSAE Engagements",
      "Fraud Considerations",
      "Data Analytics",
      "Going Concern",
      "Professional Skepticism",
    ],
    lens: "evidence, risk, independence, and professional skepticism",
  },
  REG: {
    name: "Taxation and Regulation",
    topics: [
      "Individual Tax",
      "Business Entities",
      "Property Transactions",
      "Corporate Tax",
      "Partnership Tax",
      "S Corporations",
      "Tax Procedure",
      "Agency Law",
      "Contracts",
      "Debtor-Creditor Law",
      "Business Ethics",
      "Circular 230",
    ],
    lens: "tax consequences, legal duties, compliance, and planning judgment",
  },
  BAR: {
    name: "Business Analysis and Reporting",
    topics: [
      "Managerial Analysis",
      "Financial Statement Analysis",
      "Budgeting",
      "Forecasting",
      "Variance Analysis",
      "Cost Accounting",
      "Performance Metrics",
      "Enterprise Risk",
      "Technical Accounting",
      "SEC Reporting",
      "Business Combinations",
      "Decision Models",
    ],
    lens: "business interpretation, analytics, and reporting decisions",
  },
  ISC: {
    name: "Information Systems and Controls",
    topics: [
      "IT Governance",
      "Cybersecurity",
      "System Development",
      "Data Management",
      "Access Controls",
      "Change Management",
      "SOC Engagements",
      "Incident Response",
      "Cloud Controls",
      "Business Continuity",
      "Application Controls",
      "General IT Controls",
    ],
    lens: "systems reliability, data integrity, security, and control design",
  },
  TCP: {
    name: "Tax Compliance and Planning",
    topics: [
      "Advanced Individual Tax",
      "Entity Formation",
      "Entity Liquidation",
      "Gift Tax",
      "Estate Tax",
      "Trusts",
      "Retirement Planning",
      "Multistate Tax",
      "International Tax",
      "Tax Research",
      "Tax Strategy",
      "Compliance Risk",
    ],
    lens: "tax planning, compliance accuracy, documentation, and client judgment",
  },
  HISTORY: {
    name: "Accounting History and Professional Responsibility",
    topics: [
      "Origins of Accounting",
      "Double-Entry Bookkeeping",
      "Industrial Accounting",
      "Securities Regulation",
      "The CPA Profession",
      "Audit Failures",
      "Sarbanes-Oxley",
      "Global Standards",
      "Ethics Codes",
      "Technology in Accounting",
      "Illinois Licensure History",
      "Future of the Profession",
    ],
    lens: "professional trust, public interest, ethics, and regulatory evolution",
  },
};

const difficulties = ["easy", "medium", "hard"];
const questionTypes = ["mcq", "trueFalse", "matching", "dragDrop", "scenario", "caseStudy", "calculation", "simulation"];
const skillLevels = ["remembering", "understanding", "application", "analysis", "evaluation"];

function sentenceBlock(subject, topic, lens, index) {
  return [
    `${topic} matters because CPA candidates must move beyond recognition and into explanation. In plain English, the topic asks whether the accountant can identify the economic event, decide what evidence is relevant, apply the governing rule, and communicate the conclusion in a way that another professional can trust.`,
    `In ${subject}, the exam usually tests ${lens}. A beginner may try to memorize a phrase, but a prepared candidate studies the business reason behind the rule. The strongest answer often depends on the facts that change measurement, timing, classification, disclosure, risk, or documentation.`,
    `The real-world application is direct. A controller, auditor, tax adviser, consultant, or CFO may face incomplete information, time pressure, system limitations, and competing stakeholder incentives. Mastery means slowing the problem down, naming the issue, testing assumptions, and explaining the professional judgment behind the final answer.`,
    `For exam readiness, connect the concept to task-based simulations. Ask what document would prove the point, what number would change the conclusion, what control would reduce risk, and what disclosure would prevent a user from being misled. This is how recall becomes analysis and analysis becomes professional judgment.`,
    `A useful study sequence is learn, understand, apply, analyze, evaluate, and master. Learn the vocabulary. Understand why the rule exists. Apply it to a clean example. Analyze a messy scenario. Evaluate alternatives. Master it by explaining the idea without notes and then answering a new question under time pressure.`,
    `In practice set ${index}, the candidate should also watch for traps: familiar words used in unfamiliar ways, distractors that are true but irrelevant, facts that belong to a different reporting period, and answers that ignore the public-interest role of the CPA.`,
  ].join("\n\n");
}

function terminology(subject, topic) {
  const base = [
    ["Recognition", "Deciding when an item belongs in the accounting, audit, tax, or reporting model."],
    ["Measurement", "Determining the amount, risk level, tax effect, or evidential weight of an item."],
    ["Assertion", "A claim that must be supported by evidence and professional reasoning."],
    ["Materiality", "The threshold where an error, omission, or risk could influence a user or decision maker."],
    ["Professional Judgment", "A reasoned conclusion formed from standards, facts, evidence, and ethical responsibility."],
  ];

  return base.map(([term, definition]) => ({
    term: `${topic} ${term}`,
    definition,
    plainEnglish: `Ask what the fact means, why it matters, and how it changes the ${subject} conclusion.`,
    mnemonic: `${term[0]}-${topic[0]}: connect the rule to the story before choosing an answer.`,
    example: `In a ${topic} scenario, the candidate documents the fact pattern, applies the rule, and explains the result.`,
    relatedConcepts: ["Evidence", "Documentation", "Exam simulation", "Ethics"],
    examRelevance: `High: ${topic} can appear as a conceptual MCQ, calculation, research task, or simulation.`,
  }));
}

function lessonQuiz(subject, topic, lessonNumber) {
  return Array.from({ length: 10 }, (_, i) => {
    const type = ["MCQ", "True/False", "Scenario", "Fill Blank", "Matching"][i % 5];
    const id = `${subject.toLowerCase()}-${lessonNumber}-quiz-${i + 1}`;
    const prompt = {
      MCQ: `Which action best demonstrates mastery of ${topic}?`,
      "True/False": `True or false: ${topic} should be studied only as memorized vocabulary.`,
      Scenario: `A client provides incomplete facts about ${topic}. What should the CPA candidate do first?`,
      "Fill Blank": `Fill in the blank: professional judgment requires facts, standards, evidence, and _____.`,
      Matching: `Match ${topic} to the best study behavior.`,
    }[type];
    const answer = {
      MCQ: "Apply the rule to facts and explain the conclusion.",
      "True/False": "False",
      Scenario: "Identify the issue, request relevant evidence, and document assumptions.",
      "Fill Blank": "ethics",
      Matching: "Concept to evidence-based application",
    }[type];

    return {
      id,
      type,
      question: prompt,
      options: [
        answer,
        "Memorize the phrase and ignore context.",
        "Choose the fastest answer without reading the final sentence.",
        "Assume all facts have equal importance.",
      ],
      answer,
      explanation: `${answer} is strongest because ${topic} requires a disciplined link between the facts, the rule, and the professional conclusion.`,
      examTip: "Read the final sentence first, identify the task, then return to the facts.",
      memoryHook: "Facts plus rule plus evidence plus ethics equals judgment.",
    };
  });
}

function makeLesson(subject, lessonNumber, topic) {
  const meta = subjects[subject];
  return {
    id: `${subject.toLowerCase()}-${String(lessonNumber).padStart(2, "0")}`,
    subject,
    discipline: meta.name,
    chapter: `Mastery Module ${lessonNumber}`,
    title: `${topic} Mastery`,
    masteryPath: ["Learn", "Understand", "Apply", "Analyze", "Evaluate", "Master"],
    overview: sentenceBlock(subject, topic, meta.lens, lessonNumber),
    historicalContext: {
      origins: `${topic} developed as business records, public reporting, taxation, assurance, and accountability became more complex.`,
      evolution: "The profession moved from mechanical recordkeeping toward standards-based reasoning, documentation, and public-interest decision making.",
      milestones: ["Professional standard setting", "Securities regulation", "Computerized systems", "Risk-based exams", "Data-driven analysis"],
      regulatoryChanges: "Modern rules emphasize transparency, independence, reliable evidence, internal control, and clear documentation.",
      cpaExamRelevance: `${topic} can be tested through recall, application, simulations, professional judgment, and explanation of alternatives.`,
    },
    fiveWOneH: {
      what: `${topic} is a core ${subject} mastery area connected to ${meta.lens}.`,
      why: "It matters because weak reasoning creates reporting errors, audit failures, tax exposure, control gaps, or poor business decisions.",
      who: "CPA candidates, staff accountants, auditors, tax advisers, managers, controllers, CFOs, regulators, and financial statement users.",
      when: "During transaction analysis, engagement planning, tax preparation, reporting close, control testing, advisory work, and exam simulations.",
      where: "In ledgers, workpapers, tax files, contracts, control matrices, board reports, financial statements, and client communications.",
      how: "Define the issue, gather facts, apply standards, evaluate alternatives, document judgment, and communicate the conclusion.",
    },
    terminology: terminology(subject, topic),
    workedExamples: {
      basic: `A student defines ${topic} in plain English and identifies why the issue matters.`,
      intermediate: `A candidate receives mixed facts, separates relevant from irrelevant details, and applies the correct rule.`,
      advanced: `A professional evaluates uncertainty, documents assumptions, and explains how alternative facts would change the conclusion.`,
      cpaExam: `A simulation asks for the best treatment, evidence, or response. The candidate uses exhibits rather than memory alone.`,
      realBusiness: `A business decision involving ${topic} affects reporting quality, taxes, controls, cash flow, compliance, or stakeholder trust.`,
    },
    criticalThinkingLab: [
      `What fact would most likely change the conclusion in a ${topic} problem?`,
      "Which stakeholder could be harmed if the CPA uses a shortcut?",
      "What evidence would you request before finalizing the answer?",
      "What answer choice sounds true but fails to answer the specific task?",
      "How would you explain the conclusion to a non-accountant without losing precision?",
    ],
    scenarioAnalysis: {
      scenario: `A growing Illinois business asks for help with ${topic}. Records are incomplete, management wants a fast answer, and the exam-style facts include both relevant and distracting details.`,
      decisionRequired: "Choose the treatment or response that best protects accuracy, compliance, and professional responsibility.",
      consequences: "A rushed answer can create misstatement risk, tax penalties, poor controls, failed audit evidence, or misleading communication.",
      alternatives: ["Request more evidence", "Document a reasonable assumption", "Escalate an ethical concern", "Disclose uncertainty", "Revise the calculation"],
      recommendedApproach: "Clarify the issue, map each fact to a rule, document uncertainty, then choose the answer that best fits the stated task.",
    },
    tows: {
      strengths: [`${topic} builds transferable reasoning across CPA disciplines.`],
      weaknesses: ["It can be confused with similar terms when studied only through flashcards."],
      opportunities: ["High-value practice through simulations, explanations, and mixed-topic review."],
      threats: ["Exam distractors, time pressure, incomplete exhibits, and overconfidence."],
      cpaExamRelevance: "Strong because it supports both objective questions and task-based simulations.",
    },
    commonMistakes: {
      beginner: ["Memorizing words without understanding the business event.", "Ignoring the final sentence of the question."],
      intermediate: ["Applying the right rule to the wrong period.", "Treating all facts as equally important."],
      cpaExamTraps: ["Choosing a true statement that does not answer the task.", "Missing a qualifier such as except, most likely, or least likely."],
      realWorld: ["Weak documentation.", "Failure to communicate uncertainty or ethical concerns."],
    },
    reinforcementLearning: {
      level1Recall: `Define ${topic} in one sentence and name two related concepts.`,
      level2Application: `Apply ${topic} to a clean fact pattern and explain the result.`,
      level3Analysis: "Compare two possible answers and explain why one is stronger.",
      level4ProfessionalJudgment: "Document the conclusion, evidence used, limitation, and ethical consideration.",
    },
    reflection: [
      `Can I explain ${topic} without notes?`,
      "Can I identify the exam task before reading every detail?",
      "Can I name the most dangerous distractor?",
      "Can I connect the rule to a real business consequence?",
      "Can I explain what evidence would change my conclusion?",
    ],
    aiTutorContent: {
      explainLikeIm12: `${topic} is like checking whether the story and the answer match. You look at the facts, use the rule, and explain why your answer makes sense.`,
      explainLikeCpaCandidate: `For ${topic}, focus on the task, identify relevant facts, apply the authoritative rule, and eliminate distractors.`,
      explainLikeAuditor: `Think about risk, evidence quality, documentation, independence, and whether the conclusion can be supported.`,
      explainLikeCfo: `Focus on business impact, reporting credibility, cash flow, compliance exposure, controls, and communication to stakeholders.`,
      explainLikeProfessor: `The concept becomes meaningful when students compare alternatives and defend the conclusion using standards and facts.`,
      additionalExamplesPrompt: `Generate three new examples for ${topic}: one basic, one exam-style, and one real-business scenario.`,
      harderQuestionsPrompt: `Create higher-difficulty ${subject} questions that require analysis, judgment, and explanation.`,
      socraticQuestionsPrompt: `Ask questions that force the learner to identify assumptions, evidence, consequences, and alternatives.`,
    },
    quiz: lessonQuiz(subject, topic, lessonNumber),
  };
}

function makeQuestions(subject, count) {
  const topics = subjects[subject].topics;
  return Array.from({ length: count }, (_, i) => {
    const topic = topics[i % topics.length];
    const type = questionTypes[i % questionTypes.length];
    const difficulty = difficulties[i % difficulties.length];
    const id = `${subject.toLowerCase()}-${String(i + 1).padStart(4, "0")}`;
    const answer = `Apply ${topic} using the facts, evidence, and professional judgment.`;

    return {
      id,
      subject,
      difficulty,
      type,
      topic,
      blueprintMapping: {
        area: subjects[subject].name,
        group: topic,
        skill: skillLevels[i % skillLevels.length],
      },
      question: `${subject} ${type} question ${i + 1}: A CPA candidate faces a ${topic} scenario. Which response best demonstrates exam-ready judgment?`,
      options: [
        answer,
        "Rely on a memorized phrase without using the facts.",
        "Ignore evidence that conflicts with the preferred conclusion.",
        "Choose the broadest answer even if it does not address the task.",
      ],
      answer,
      explanation: `The best response connects ${topic} to the facts, governing rule, evidence, and professional responsibility. The distractors are weak because they either ignore the task, skip evidence, or overgeneralize.`,
      examTip: "Identify the required action before calculating or selecting an answer.",
      memoryHook: "Task, facts, rule, evidence, judgment.",
    };
  });
}

function makeVocabulary(count) {
  const seedTerms = [
    "Asset",
    "Liability",
    "Equity",
    "Revenue",
    "Expense",
    "Materiality",
    "Internal Control",
    "Independence",
    "Basis",
    "Depreciation",
    "Amortization",
    "Accrual",
    "Deferral",
    "Audit Evidence",
    "Taxable Income",
    "Deferred Tax",
    "Sampling Risk",
    "Substantive Procedure",
    "Control Deficiency",
    "Professional Skepticism",
    "Going Concern",
    "SOC Report",
    "Variance",
    "Forecast",
    "Gift Tax",
    "Estate Tax",
    "Cybersecurity",
    "Access Control",
    "Contract",
    "Agency",
  ];
  const subjectKeys = ["FAR", "AUD", "REG", "BAR", "ISC", "TCP", "GENERAL"];

  return Array.from({ length: count }, (_, i) => {
    const subject = subjectKeys[i % subjectKeys.length];
    const base = seedTerms[i % seedTerms.length];
    const term = `${base} ${Math.floor(i / seedTerms.length) + 1}`;
    return {
      id: `v${String(i + 1).padStart(4, "0")}`,
      subject,
      term,
      definition: `${term} is a CPA exam concept used to analyze reporting, audit, tax, systems, business, or professional responsibility questions.`,
      simpleDefinition: `Plain English: ${term} is a label for a fact or decision that changes the professional answer.`,
      mnemonic: `${base.split(" ").map((word) => word[0]).join("")}: connect the word to the business story.`,
      example: `A candidate sees ${term} in a scenario, identifies the relevant facts, and explains the consequence.`,
      relatedTerms: ["Evidence", "Documentation", "Materiality", "Professional judgment"],
      relatedConcepts: ["Exam task", "Real-world consequence", "Ethics"],
      difficulty: difficulties[i % difficulties.length],
      quizQuestion: {
        question: `Why does ${term} matter on the CPA exam?`,
        answer: "It changes the analysis, evidence needed, or professional conclusion.",
        explanation: "Vocabulary is tested through application, not definition alone.",
      },
    };
  });
}

function makeCaseStudies(count) {
  const named = [
    "Enron",
    "WorldCom",
    "Arthur Andersen",
    "Wirecard",
    "FTX",
    "Lehman Brothers",
    "Tyco",
    "HealthSouth",
    "Satyam",
    "Parmalat",
  ];
  const themes = ["revenue recognition", "audit independence", "governance", "internal controls", "tax compliance", "cybersecurity", "cash flow reporting", "inventory valuation", "related-party transactions", "ethics"];

  return Array.from({ length: count }, (_, i) => {
    const company = named[i] || `CPA Case ${i + 1}`;
    const theme = themes[i % themes.length];
    return {
      id: `case-${String(i + 1).padStart(3, "0")}`,
      title: `${company}: ${theme} failure analysis`,
      company,
      category: theme,
      background: `${company} is used as a professional judgment case for studying ${theme}, governance, incentives, evidence, and public trust.`,
      summary: `${company} illustrates how weak judgment, poor controls, pressure, or incomplete evidence can create accounting, audit, tax, or governance failure.`,
      timeline: [
        { year: "Stage 1", event: "Business pressure or control weakness emerges." },
        { year: "Stage 2", event: "Warning signs are missed, rationalized, or poorly documented." },
        { year: "Stage 3", event: "Stakeholders discover the failure and consequences follow." },
      ],
      rootCause: "Misaligned incentives, weak oversight, poor documentation, insufficient skepticism, or ineffective controls.",
      failureAnalysis: ["Facts were not challenged.", "Evidence quality was overestimated.", "Governance did not respond early enough."],
      ethicsAnalysis: "The case highlights the CPA duty to protect the public interest, communicate honestly, and resist pressure.",
      auditAnalysis: "An auditor should evaluate risk, controls, evidence sufficiency, independence, and management bias.",
      tows: {
        strengths: ["Clear teaching value", "Strong connection to professional judgment"],
        weaknesses: ["Facts can be complex", "Hindsight bias can distort learning"],
        opportunities: ["Practice skepticism and documentation", "Connect case facts to exam simulations"],
        threats: ["Memorizing the scandal instead of analyzing the control failure"],
      },
      lessonsLearned: ["Pressure increases risk.", "Documentation matters.", "Skepticism must be visible in workpapers."],
      lessons: ["Pressure increases risk.", "Documentation matters.", "Skepticism must be visible in workpapers."],
      cpaExamRelevance: ["Ethics", "Audit evidence", "Internal control", "Reporting quality", "Professional responsibility"],
      criticalThinkingQuestions: [
        "What warning sign should have triggered additional work?",
        "What evidence would be most persuasive?",
        "Which party had the strongest duty to act?",
        "What control could have reduced the risk?",
        "How would this appear in a CPA simulation?",
      ],
      quiz: lessonQuiz("AUD", theme, i + 1).slice(0, 5),
    };
  });
}

function makeMockExams(count) {
  const subjectKeys = ["FAR", "AUD", "REG", "BAR", "ISC", "TCP"];
  return Array.from({ length: count }, (_, i) => {
    const subject = subjectKeys[i % subjectKeys.length];
    return {
      id: `mock-${String(i + 1).padStart(2, "0")}`,
      title: `Mock CPA Exam ${i + 1}: ${subject} Readiness`,
      subject,
      durationMinutes: subject === "FAR" || subject === "AUD" || subject === "REG" ? 240 : 180,
      questionIds: Array.from({ length: 30 }, (_, q) => `${subject.toLowerCase()}-${String(((i * 30 + q) % 200) + 1).padStart(4, "0")}`),
      scoring: {
        passingTarget: 75,
        weighting: "Blend conceptual accuracy, simulation performance, pacing, and explanation quality.",
      },
      answerExplanations: "Review every missed item by classifying the miss as recall, application, analysis, or judgment.",
      readinessAnalysis: "Scores below 70 require targeted review; 70-79 requires mixed practice; 80+ requires timed simulations and retention work.",
      weaknessDetection: ["Topic misses", "Difficulty misses", "Pacing misses", "Simulation misses", "Judgment misses"],
      studyRecommendations: ["Redo missed concepts", "Write one-sentence rules", "Practice mixed sets", "Review explanations aloud", "Schedule a timed retake"],
    };
  });
}

function makeIllinoisPathway() {
  const stages = [
    "Choose CPA Exam Discipline",
    "Evaluate Education Requirements",
    "Apply to Sit for the CPA Exam",
    "Schedule NTS and Exam Sections",
    "Prepare for Core Sections",
    "Prepare for Discipline Section",
    "Pass CPA Exam Sections",
    "Complete Illinois Ethics Requirement",
    "Document Work Experience",
    "Apply for Illinois CPA License",
    "Maintain CPE",
    "Renew Illinois License",
  ];

  return stages.map((stage, i) => ({
    id: `il-${String(i + 1).padStart(2, "0")}`,
    label: stage,
    completed: false,
    overview: `${stage} is a required planning stage in the Illinois CPA pathway. Candidates should confirm current rules with the Illinois Board of Examiners and Illinois Department of Financial and Professional Regulation before acting.`,
    description: `Complete the ${stage.toLowerCase()} milestone and keep supporting documentation.`,
    requirements: ["Confirm eligibility", "Gather documentation", "Track deadlines", "Retain proof of completion"],
    costs: ["Application fees", "Exam fees", "Transcript fees", "Review materials where applicable"],
    documents: ["Transcripts", "Identification", "NTS", "Score reports", "Experience verification", "Ethics completion"],
    commonMistakes: ["Waiting too long to request transcripts", "Missing expiration windows", "Not saving confirmations"],
    successTips: ["Create a milestone calendar", "Keep a digital folder", "Verify requirements before paying fees"],
    timeline: "Plan this stage at least 4-8 weeks before the related deadline when possible.",
    faq: [
      {
        question: `What should I verify for ${stage}?`,
        answer: "Verify current Illinois requirements, deadlines, documents, fees, and responsible agency.",
      },
      {
        question: "What is the best habit?",
        answer: "Save every confirmation, score notice, receipt, and official message.",
      },
    ],
  }));
}

const lessonFiles = {};
for (const subject of Object.keys(subjects)) {
  const lessons = subjects[subject].topics.map((topic, i) => makeLesson(subject, i + 1, topic));
  lessonFiles[subject] = lessons;
  const fileName = subject === "HISTORY" ? "history.json" : `${subject.toLowerCase()}.json`;
  writeFileSync(join(outDir, fileName), `${JSON.stringify(lessons, null, 2)}\n`);
}

const questionDistribution = { FAR: 600, AUD: 400, REG: 400, BAR: 200, ISC: 200, TCP: 200 };
const questions = Object.entries(questionDistribution).flatMap(([subject, count]) => makeQuestions(subject, count));
const lessons = Object.values(lessonFiles).flat();
const vocabulary = makeVocabulary(1500);
const caseStudies = makeCaseStudies(100);
const mockExams = makeMockExams(20);
const pathway = makeIllinoisPathway();

writeFileSync(join(outDir, "lessons.json"), `${JSON.stringify(lessons, null, 2)}\n`);
writeFileSync(join(outDir, "questions.json"), `${JSON.stringify(questions, null, 2)}\n`);
writeFileSync(join(outDir, "vocabulary.json"), `${JSON.stringify(vocabulary, null, 2)}\n`);
writeFileSync(join(outDir, "casestudies.json"), `${JSON.stringify(caseStudies, null, 2)}\n`);
writeFileSync(join(outDir, "mockexams.json"), `${JSON.stringify(mockExams, null, 2)}\n`);
writeFileSync(join(outDir, "illinois-pathway.json"), `${JSON.stringify(pathway, null, 2)}\n`);
writeFileSync(join(outDir, "pathway.json"), `${JSON.stringify(pathway, null, 2)}\n`);

console.log("Generated mastery content:");
console.log(`Lessons: ${lessons.length}`);
console.log(`Vocabulary: ${vocabulary.length}`);
console.log(`Questions: ${questions.length}`);
console.log(`Case studies: ${caseStudies.length}`);
console.log(`Mock exams: ${mockExams.length}`);
console.log(`Illinois pathway stages: ${pathway.length}`);
