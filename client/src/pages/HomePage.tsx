import { Link } from "react-router-dom";
import { RefreshCw, CheckCircle2, CloudDownload, Clock, Calculator, FlaskConical, ScrollText, BookOpen } from "lucide-react";
import { LESSONS, SUBJECT_META } from "../lib/subjects";

const SUBJECT_ICONS: Record<string, any> = {
  Calculator,
  FlaskConical,
  ScrollText,
  BookOpen
};

export default function HomePage() {
  // Derive stats from lesson data
  const totalLessons = LESSONS.length;
  const completedLessons = LESSONS.filter(
    (l) => l.progressPercent === 100,
  ).length;
  const inProgressLessons = LESSONS.filter(
    (l) => l.progressPercent > 0 && l.progressPercent < 100,
  );
  const avgProgress = Math.round(
    LESSONS.reduce((sum, l) => sum + l.progressPercent, 0) / totalLessons,
  );
  const continueLesson = inProgressLessons.sort(
    (a, b) => b.progressPercent - a.progressPercent,
  )[0];
  const syncedCount = LESSONS.filter((l) => l.synced).length;
  const storageUsedGB = ((syncedCount * 35) / 1024).toFixed(1); // ~35MB per lesson placeholder

  return (
    <div className="space-y-8 pb-12">
      {/* Greeting */}
      <header className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Hi, Student! 👋</h1>
          <p className="text-text-subtle text-sm">Welcome back to your learning journey.</p>
        </div>
        <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center text-white font-bold text-lg shadow-sm">
          S
        </div>
      </header>

      {/* ── This Week's Progress ───────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Weekly Progress</h2>
          <Link
            to="/lessons"
            className="text-sm font-medium text-accent hover:underline"
          >
            Details
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="card flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-50">
              <RefreshCw size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{avgProgress}%</p>
              <p className="text-xs text-text-subtle uppercase tracking-wider font-semibold">Average Progress</p>
            </div>
          </div>
          <div className="card flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-50">
              <CheckCircle2 size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{completedLessons}</p>
              <p className="text-xs text-text-subtle uppercase tracking-wider font-semibold">Completed</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Continue Learning ──────────────────────────────────── */}
      {continueLesson && (
        <section>
          <h2 className="text-lg font-semibold mb-4">Continue Learning</h2>
          <Link
            to={`/tutor?subject=${continueLesson.subject}&lesson=${continueLesson.id}`}
            className="group block card overflow-hidden relative border-none bg-slate-900 text-white hover:shadow-lg transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 opacity-90" />
            <div className="relative p-6">
              <span
                className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3 ${SUBJECT_META[continueLesson.subject].bgColor} ${SUBJECT_META[continueLesson.subject].color}`}
              >
                {SUBJECT_META[continueLesson.subject].label}
              </span>
              <h3 className="text-xl font-bold mb-4 group-hover:text-accent transition-colors">{continueLesson.title}</h3>
              
              <div className="flex items-center justify-between text-sm mb-2 opacity-80">
                <span>Chapter {continueLesson.chapter} of {continueLesson.totalChapters}</span>
                <span className="font-mono">{continueLesson.progressPercent}%</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-500"
                  style={{ width: `${continueLesson.progressPercent}%` }}
                />
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* ── Offline Status ─────────────────────────── */}
      <section className="card border-accent/20 bg-accent/[0.02]">
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CloudDownload size={20} className="text-accent" />
              <h2 className="font-semibold">Local Learning Hub</h2>
            </div>
            <p className="text-sm text-text-subtle mb-4">
              Your lessons are available offline. Sync to get the latest content.
            </p>
            <Link to="/brain-sync" className="btn-accent inline-flex items-center gap-2">
              <RefreshCw size={14} />
              Sync Library
            </Link>
          </div>
          <div className="w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 sm:border-l border-border sm:pl-6 shrink-0">
            <p className="text-xs text-text-subtle mb-1 uppercase tracking-wider font-semibold">Storage Used</p>
            <p className="text-lg font-bold">{storageUsedGB} GB <span className="text-sm font-normal text-text-subtle">/ 5 GB</span></p>
            <div className="w-32 h-1.5 bg-surface rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-accent w-[15%]" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Recommended ────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">New Lessons</h2>
          <Link
            to="/lessons"
            className="text-sm font-medium text-accent hover:underline"
          >
            Explore
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {LESSONS.filter((l) => l.progressPercent === 0)
            .slice(0, 4)
            .map((lesson) => {
              const meta = SUBJECT_META[lesson.subject];
              const Icon = SUBJECT_ICONS[meta.icon];
              return (
                <Link
                  key={lesson.id}
                  to={`/tutor?subject=${lesson.subject}&lesson=${lesson.id}`}
                  className="card p-0 overflow-hidden hover:border-accent transition-colors group"
                >
                  <div className={`h-24 ${meta.bgColor} flex items-center justify-center group-hover:opacity-80 transition-opacity`}>
                    {Icon && <Icon size={40} className={meta.color} />}
                  </div>
                  <div className="p-4">
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${meta.color}`}>
                      {meta.label}
                    </span>
                    <p className="font-semibold text-sm mt-1 line-clamp-1 group-hover:text-accent transition-colors">
                      {lesson.title}
                    </p>
                    <div className="flex items-center gap-1.5 mt-2 text-text-subtle">
                       <Clock size={12} />
                       <span className="text-[11px] font-medium">{lesson.durationMins} min</span>
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>
      </section>
    </div>
  );
}
