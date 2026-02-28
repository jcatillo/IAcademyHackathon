import { useState } from "react";
import { Link } from "react-router-dom";
import {
  LESSONS,
  SUBJECT_META,
  type Subject,
  type Lesson,
} from "../lib/subjects";

const FILTER_ALL = "all" as const;
type Filter = typeof FILTER_ALL | Subject;

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All Subjects" },
  { key: "math", label: "Math" },
  { key: "science", label: "Science" },
  { key: "history", label: "History" },
  { key: "reading", label: "Reading" },
];

export default function LessonsPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>("all");

  const filtered =
    activeFilter === "all"
      ? LESSONS
      : LESSONS.filter((l) => l.subject === activeFilter);

  // The lesson with the most progress that isn't complete
  const continueLesson = filtered
    .filter((l) => l.progressPercent > 0 && l.progressPercent < 100)
    .sort((a, b) => b.progressPercent - a.progressPercent)[0];

  const upNext = filtered.filter((l) => l.id !== continueLesson?.id);

  const isOnline = navigator.onLine;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-5 pt-5 pb-3">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button className="material-symbols-outlined text-slate-900 dark:text-white text-2xl">
              menu
            </button>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">
              Sync'd Lessons
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                isOnline
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400"
                  : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
              }`}
            >
              <span className="material-symbols-outlined text-[12px]">
                {isOnline ? "wifi" : "wifi_off"}
              </span>
              {isOnline ? "ONLINE" : "OFFLINE"}
            </span>
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
              S
            </div>
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-5 px-5 pb-1">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border-2 transition-colors ${
                activeFilter === key
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700 hover:border-slate-400"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      {/* ── Continue Learning card ─────────────────────────────── */}
      {continueLesson && (
        <section className="px-5 mt-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Continue Learning
            </h2>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">
              Last Viewed
            </span>
          </div>
          <Link
            to={`/tutor?subject=${continueLesson.subject}&lesson=${continueLesson.id}`}
            className="block rounded-2xl bg-slate-900 dark:bg-slate-800 p-5 text-white"
          >
            <div className="flex items-center gap-2 mb-3">
              <span
                className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md ${SUBJECT_META[continueLesson.subject].bgColor} ${SUBJECT_META[continueLesson.subject].color}`}
              >
                {SUBJECT_META[continueLesson.subject].label}
              </span>
              {continueLesson.synced && (
                <span className="flex items-center gap-0.5 text-emerald-400 text-[10px] font-semibold">
                  <span className="material-symbols-outlined text-[14px]">
                    check_circle
                  </span>
                  READY
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold">
              Week {continueLesson.week}: {continueLesson.title}
            </h3>
            <div className="flex items-center justify-between mt-4 text-xs text-slate-300">
              <span>{continueLesson.progressPercent}% Complete</span>
              <span>
                {Math.round(
                  (continueLesson.durationMins *
                    (100 - continueLesson.progressPercent)) /
                    100,
                )}
                m left
              </span>
            </div>
            <div className="mt-1.5 h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${continueLesson.progressPercent}%` }}
              />
            </div>
          </Link>
        </section>
      )}

      {/* ── Up Next list ───────────────────────────────────────── */}
      <section className="px-5 mt-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          Up Next
        </h2>
        <div className="space-y-3">
          {upNext.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))}
          {upNext.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-8">
              No lessons for this filter
            </p>
          )}
        </div>
      </section>

      {/* ── Study Tip ──────────────────────────────────────────── */}
      <section className="px-5 mt-6">
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <p className="text-sm font-bold text-amber-900 dark:text-amber-200">
                Study Tip
              </p>
              <p className="text-xs text-amber-800 dark:text-amber-300 mt-1 leading-relaxed">
                Stuck on a problem? Try explaining it out loud to the AI Tutor.
                Articulating the steps often reveals the solution.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ── Lesson card component ──────────────────────────────────────────
function LessonCard({ lesson }: { lesson: Lesson }) {
  const meta = SUBJECT_META[lesson.subject];
  return (
    <Link
      to={`/tutor?subject=${lesson.subject}&lesson=${lesson.id}`}
      className="flex items-center gap-3 bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
    >
      {/* Subject icon */}
      <div
        className={`w-12 h-12 rounded-xl ${meta.bgColor} flex items-center justify-center shrink-0`}
      >
        <span className={`material-symbols-outlined text-2xl ${meta.color}`}>
          {meta.icon}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
            {lesson.title}
          </p>
          {lesson.synced && (
            <span className="material-symbols-outlined text-emerald-500 text-[16px] shrink-0">
              check_circle
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {meta.label} · Week {lesson.week}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="inline-flex items-center px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-semibold rounded-md">
            {lesson.durationMins} mins
          </span>
          {lesson.hasQuiz && (
            <span className="inline-flex items-center px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-semibold rounded-md">
              Quiz included
            </span>
          )}
        </div>
      </div>

      {/* Chevron */}
      <span className="material-symbols-outlined text-slate-400 text-xl shrink-0">
        chevron_right
      </span>
    </Link>
  );
}
