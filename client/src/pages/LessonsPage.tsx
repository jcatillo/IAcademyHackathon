import { useState } from "react";
import { Link } from "react-router-dom";
import { Wifi, WifiOff, CheckCircle2, Library, Clock, HelpCircle, ChevronRight, Calculator, FlaskConical, ScrollText, BookOpen } from "lucide-react";
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

const SUBJECT_ICONS: Record<string, any> = {
  Calculator,
  FlaskConical,
  ScrollText,
  BookOpen
};

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
    <div className="space-y-8 pb-12">
      {/* Header */}
      <header className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Your Library</h1>
          <div className="flex items-center gap-3">
             <span
              className={`inline-flex items-center gap-1 text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full border ${
                isOnline
                  ? "bg-blue-50 text-blue-700 border-blue-100"
                  : "bg-emerald-50 text-emerald-700 border-emerald-100"
              }`}
            >
              {isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
              {isOnline ? "ONLINE" : "OFFLINE"}
            </span>
            <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center text-white text-sm font-bold shadow-sm">
              S
            </div>
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-1 sm:mx-0 sm:px-0">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={`shrink-0 px-5 py-2 rounded-full text-xs font-semibold transition-all border ${
                activeFilter === key
                  ? "bg-accent text-white border-accent shadow-sm"
                  : "bg-white text-text-subtle border-border hover:border-accent hover:text-accent"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      {/* ── Continue Learning card ─────────────────────────────── */}
      {continueLesson && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-text-subtle mb-4">
            Pick up where you left off
          </h2>
          <Link
            to={`/tutor?subject=${continueLesson.subject}&lesson=${continueLesson.id}`}
            className="group block card bg-slate-900 border-none text-white hover:shadow-lg transition-all"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span
                  className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${SUBJECT_META[continueLesson.subject].bgColor} ${SUBJECT_META[continueLesson.subject].color}`}
                >
                  {SUBJECT_META[continueLesson.subject].label}
                </span>
                {continueLesson.synced && (
                  <span className="flex items-center gap-1 text-emerald-400 text-[10px] font-bold tracking-wider">
                    <CheckCircle2 size={14} />
                    SYNCED
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold group-hover:text-accent transition-colors">
                Week {continueLesson.week}: {continueLesson.title}
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
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
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-500"
                    style={{ width: `${continueLesson.progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* ── Up Next list ───────────────────────────────────────── */}
      <section>
        <h2 className="text-xs font-bold uppercase tracking-widest text-text-subtle mb-4">
          All Lessons
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upNext.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))}
          {upNext.length === 0 && (
            <div className="col-span-full py-12 card bg-surface border-dashed flex flex-col items-center justify-center text-text-subtle">
               <Library size={40} className="mb-2" />
               <p className="text-sm font-medium">No lessons found for this subject.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Study Tip ──────────────────────────────────────────── */}
      <section>
        <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="bg-white p-2 rounded-xl shadow-sm">
              <span className="text-xl">💡</span>
            </div>
            <div>
              <p className="text-sm font-bold text-blue-900 mb-1">Study Tip</p>
              <p className="text-xs text-blue-800 leading-relaxed opacity-80">
                Stuck on a problem? Try explaining it out loud to the AI Tutor.
                Articulating the steps often reveals the solution and builds deeper understanding.
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
  const Icon = SUBJECT_ICONS[meta.icon];
  return (
    <Link
      to={`/tutor?subject=${lesson.subject}&lesson=${lesson.id}`}
      className="group flex items-center gap-4 card hover:border-accent transition-all"
    >
      {/* Subject icon */}
      <div
        className={`w-14 h-14 rounded-2xl ${meta.bgColor} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}
      >
        {Icon && <Icon size={30} className={meta.color} />}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-sm font-bold text-text truncate group-hover:text-accent transition-colors">
            {lesson.title}
          </p>
          {lesson.synced && (
            <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
          )}
        </div>
        <p className="text-xs text-text-subtle font-medium">
          {meta.label} · Week {lesson.week}
        </p>
        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center gap-1 text-[10px] font-bold text-text-subtle uppercase tracking-wider">
            <Clock size={14} />
            {lesson.durationMins}m
          </div>
          {lesson.hasQuiz && (
             <div className="flex items-center gap-1 text-[10px] font-bold text-accent uppercase tracking-wider">
               <HelpCircle size={14} />
               Quiz
             </div>
          )}
        </div>
      </div>

      <ChevronRight size={20} className="text-border group-hover:text-accent transition-colors" />
    </Link>
  );
}
