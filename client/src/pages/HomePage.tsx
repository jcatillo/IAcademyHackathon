import { Link } from "react-router-dom";
import { RefreshCw, CheckCircle2, CloudDownload, Clock, Calculator, FlaskConical, ScrollText, BookOpen, ChevronRight } from "lucide-react";
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
    <div className="space-y-10 pb-16">
      {/* Greeting */}
      <header className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text">Hi, Student! 👋</h1>
          <p className="text-text-subtle text-sm font-medium">Your personalized learning hub is ready.</p>
        </div>
        <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-accent/20">
          S
        </div>
      </header>

      {/* ── This Week's Progress ───────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-text uppercase tracking-widest text-[12px]">Weekly Progress</h2>
          <Link
            to="/lessons"
            className="text-xs font-bold text-accent hover:text-accent-hover transition-colors flex items-center gap-1"
          >
            View Details <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="card flex items-center gap-5 border-l-4 border-l-blue-500 shadow-sm">
            <div className="p-3 rounded-2xl bg-blue-50">
              <RefreshCw size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-text">{avgProgress}%</p>
              <p className="text-[10px] text-text-subtle uppercase tracking-widest font-bold">Course Mastery</p>
            </div>
          </div>
          <div className="card flex items-center gap-5 border-l-4 border-l-emerald-500 shadow-sm">
            <div className="p-3 rounded-2xl bg-emerald-50">
              <CheckCircle2 size={24} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-text">{completedLessons}</p>
              <p className="text-[10px] text-text-subtle uppercase tracking-widest font-bold">Lessons Finished</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Continue Learning ──────────────────────────────────── */}
      {continueLesson && (
        <section>
          <h2 className="text-lg font-bold text-text uppercase tracking-widest text-[12px] mb-5">Next in your path</h2>
          <Link
            to={`/tutor?subject=${continueLesson.subject}&lesson=${continueLesson.id}`}
            className="group block card bg-white border-2 border-accent/10 hover:border-accent/30 hover:shadow-xl transition-all duration-500 relative overflow-hidden"
          >
            {/* Subtle background decoration */}
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
              {SUBJECT_ICONS[SUBJECT_META[continueLesson.subject].icon] && 
                <div className={SUBJECT_META[continueLesson.subject].color}>
                   {(() => {
                     const Icon = SUBJECT_ICONS[SUBJECT_META[continueLesson.subject].icon];
                     return <Icon size={120} />;
                   })()}
                </div>
              }
            </div>

            <div className="relative space-y-5">
              <div className="flex items-center justify-between">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.15em] ${SUBJECT_META[continueLesson.subject].bgColor} ${SUBJECT_META[continueLesson.subject].color}`}
                >
                  {SUBJECT_META[continueLesson.subject].label}
                </span>
                <span className="text-[10px] font-bold text-text-subtle uppercase tracking-widest flex items-center gap-1">
                  <Clock size={12} /> {continueLesson.durationMins}m left
                </span>
              </div>
              
              <div>
                <h3 className="text-2xl font-extrabold text-text group-hover:text-accent transition-colors leading-tight">
                  {continueLesson.title}
                </h3>
                <p className="text-sm text-text-subtle mt-1 font-medium">Chapter {continueLesson.chapter} of {continueLesson.totalChapters}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-text uppercase tracking-tighter">
                  <span>Progress</span>
                  <span className="text-accent">{continueLesson.progressPercent}%</span>
                </div>
                <div className="h-3 bg-surface rounded-full overflow-hidden border border-border">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(79,70,229,0.2)]"
                    style={{ width: `${continueLesson.progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* ── Offline Hub ─────────────────────────── */}
      <section className="card bg-surface border-none shadow-inner py-8 px-8">
        <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
          <div className="text-center md:text-left space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-border shadow-sm">
              <CloudDownload size={16} className="text-accent" />
              <span className="text-[10px] font-black text-text uppercase tracking-widest">Local Learning Enabled</span>
            </div>
            <h2 className="text-2xl font-extrabold text-text">Your Library is Synced</h2>
            <p className="text-sm text-text-subtle max-w-sm font-medium">
              Access your lessons, AI tutor, and progress markers entirely without an internet connection.
            </p>
            <Link to="/brain-sync" className="btn-accent inline-flex items-center gap-2 px-8 py-3">
              <RefreshCw size={16} />
              Refresh Offline Data
            </Link>
          </div>
          <div className="w-full md:w-auto card bg-white border border-border p-6 text-center shadow-sm shrink-0">
            <p className="text-[10px] text-text-subtle mb-2 uppercase tracking-widest font-bold">Local Storage</p>
            <p className="text-3xl font-black text-text mb-3">{storageUsedGB} GB <span className="text-sm font-medium text-text-subtle">/ 5 GB</span></p>
            <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden">
              <div className="h-full bg-accent w-[15%] transition-all duration-1000" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Recommended ────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-text uppercase tracking-widest text-[12px]">Recommended</h2>
          <Link
            to="/lessons"
            className="text-xs font-bold text-accent hover:underline"
          >
            See All
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {LESSONS.filter((l) => l.progressPercent === 0)
            .slice(0, 4)
            .map((lesson) => {
              const meta = SUBJECT_META[lesson.subject];
              const Icon = SUBJECT_ICONS[meta.icon];
              return (
                <Link
                  key={lesson.id}
                  to={`/tutor?subject=${lesson.subject}&lesson=${lesson.id}`}
                  className="card p-0 overflow-hidden hover:border-accent hover:shadow-lg transition-all group flex flex-col h-full"
                >
                  <div className={`h-24 ${meta.bgColor} flex items-center justify-center group-hover:scale-105 transition-transform duration-500`}>
                    {Icon && <Icon size={40} className={meta.color} />}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] mb-1 ${meta.color}`}>
                      {meta.label}
                    </span>
                    <p className="font-bold text-text text-sm leading-tight group-hover:text-accent transition-colors flex-1">
                      {lesson.title}
                    </p>
                    <div className="flex items-center gap-1.5 mt-4 text-text-subtle">
                       <Clock size={12} />
                       <span className="text-[10px] font-bold uppercase tracking-tight">{lesson.durationMins} min</span>
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
