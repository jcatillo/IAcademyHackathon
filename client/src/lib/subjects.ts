// ── Subject definitions & lesson data ──────────────────────────────
export interface Lesson {
  id: string;
  title: string;
  subject: Subject;
  week: number;
  chapter: number;
  totalChapters: number;
  progressPercent: number;
  durationMins: number;
  hasQuiz: boolean;
  /** Whether this lesson's content has been synced for offline */
  synced: boolean;
}

export type Subject = "math" | "science" | "history" | "reading";

export const SUBJECT_META: Record<
  Subject,
  { label: string; icon: string; color: string; bgColor: string }
> = {
  math: {
    label: "Math",
    icon: "Calculator",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  science: {
    label: "Science",
    icon: "FlaskConical",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  history: {
    label: "History",
    icon: "ScrollText",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  reading: {
    label: "Reading",
    icon: "BookOpen",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
};

// ── Subject-specific system prompts ────────────────────────────────
export const SUBJECT_PROMPTS: Record<Subject, string> = {
  math: `You are a Socratic Math Tutor running offline on this student's device.
Focus on: arithmetic, algebra, geometry, and word problems.
- Never give the answer directly.
- Ask guiding questions and give small hints step by step.
- Use simple examples and analogies.
- Celebrate correct steps and gently redirect mistakes.
- Stay concise (2-3 sentences per reply).`,

  science: `You are a Socratic Science Tutor running offline on this student's device.
Focus on: physics concepts, chemistry basics, biology, and the scientific method.
- Never give the answer directly.
- Ask guiding questions that encourage hypothesis and observation.
- Relate concepts to everyday life the student might experience.
- Celebrate correct reasoning and gently redirect misconceptions.
- Stay concise (2-3 sentences per reply).`,

  history: `You are a Socratic History Tutor running offline on this student's device.
Focus on: world history, civilizations, historical events, cause and effect.
- Never give the answer directly.
- Ask leading questions that encourage the student to think about motivations and consequences.
- Help students connect historical events to patterns.
- Celebrate correct analysis and gently redirect mistakes.
- Stay concise (2-3 sentences per reply).`,

  reading: `You are a Socratic Reading Comprehension Tutor running offline on this student's device.
Focus on: reading comprehension, vocabulary, inference, and critical thinking.
- Never give the answer directly.
- Ask questions that help students find evidence in the text.
- Help build vocabulary through context clues.
- Celebrate correct interpretations and gently redirect misunderstandings.
- Stay concise (2-3 sentences per reply).`,
};

// ── Demo lesson data ───────────────────────────────────────────────
export const LESSONS: Lesson[] = [
  {
    id: "math-w1",
    title: "Linear Equations",
    subject: "math",
    week: 1,
    chapter: 4,
    totalChapters: 12,
    progressPercent: 60,
    durationMins: 15,
    hasQuiz: true,
    synced: true,
  },
  {
    id: "math-w2",
    title: "Quadratic Functions",
    subject: "math",
    week: 2,
    chapter: 1,
    totalChapters: 10,
    progressPercent: 0,
    durationMins: 15,
    hasQuiz: true,
    synced: true,
  },
  {
    id: "science-w1",
    title: "Atomic Structure",
    subject: "science",
    week: 1,
    chapter: 3,
    totalChapters: 8,
    progressPercent: 40,
    durationMins: 45,
    hasQuiz: false,
    synced: true,
  },
  {
    id: "science-w2",
    title: "Forces & Motion",
    subject: "science",
    week: 2,
    chapter: 1,
    totalChapters: 6,
    progressPercent: 0,
    durationMins: 30,
    hasQuiz: true,
    synced: true,
  },
  {
    id: "history-w1",
    title: "The Renaissance",
    subject: "history",
    week: 1,
    chapter: 5,
    totalChapters: 8,
    progressPercent: 70,
    durationMins: 30,
    hasQuiz: false,
    synced: true,
  },
  {
    id: "history-w2",
    title: "Industrial Revolution",
    subject: "history",
    week: 2,
    chapter: 1,
    totalChapters: 10,
    progressPercent: 0,
    durationMins: 25,
    hasQuiz: true,
    synced: false,
  },
  {
    id: "reading-w1",
    title: "Inference & Evidence",
    subject: "reading",
    week: 1,
    chapter: 6,
    totalChapters: 8,
    progressPercent: 80,
    durationMins: 20,
    hasQuiz: false,
    synced: true,
  },
  {
    id: "reading-w2",
    title: "Vocabulary in Context",
    subject: "reading",
    week: 2,
    chapter: 1,
    totalChapters: 6,
    progressPercent: 0,
    durationMins: 20,
    hasQuiz: true,
    synced: true,
  },
];
