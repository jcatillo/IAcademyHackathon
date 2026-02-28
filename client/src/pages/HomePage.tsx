import { Link } from "react-router-dom";
import { LESSONS, SUBJECT_META } from "../lib/subjects";

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      {/* Greeting */}
      <header className="px-5 pt-6 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Hi, Student! 👋
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Keep up the good work
          </p>
        </div>
        <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
          S
        </div>
      </header>

      {/* ── This Week's Progress ───────────────────────────────── */}
      <section className="px-5 mt-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            This Week's Progress
          </h2>
          <Link
            to="/lessons"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400"
          >
            View Report
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800">
            <span className="material-symbols-outlined text-blue-500 text-2xl">
              sync
            </span>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
              {avgProgress}%
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Course Progress
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800">
            <span className="material-symbols-outlined text-emerald-500 text-2xl">
              check_circle
            </span>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
              {completedLessons}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Lessons Completed
            </p>
          </div>
        </div>
      </section>

      {/* ── Continue Learning ──────────────────────────────────── */}
      {continueLesson && (
        <section className="px-5 mt-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-3">
            Continue Learning
          </h2>
          <Link
            to={`/tutor?subject=${continueLesson.subject}&lesson=${continueLesson.id}`}
            className="block rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 relative"
          >
            {/* Dark overlay card */}
            <div className="p-5 text-white">
              <span
                className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${SUBJECT_META[continueLesson.subject].bgColor} ${SUBJECT_META[continueLesson.subject].color}`}
              >
                {SUBJECT_META[continueLesson.subject].label}
              </span>
              <h3 className="text-lg font-bold mt-2">{continueLesson.title}</h3>
              <div className="flex items-center justify-between mt-3 text-xs text-slate-300">
                <span>
                  Chapter {continueLesson.chapter} of{" "}
                  {continueLesson.totalChapters}
                </span>
                <span>{continueLesson.progressPercent}%</span>
              </div>
              <div className="mt-1.5 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${continueLesson.progressPercent}%` }}
                />
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* ── Ready for Offline Learning ─────────────────────────── */}
      <section className="px-5 mt-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-slate-900 dark:text-white text-xl">
            cloud_download
          </span>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Ready for Offline Learning
          </h2>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800">
          <div className="flex gap-4">
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Download New Content
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Update your local library for offline study sessions.
              </p>
              <Link
                to="/brain-sync"
                className="inline-flex items-center gap-1.5 mt-3 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-full"
              >
                <span className="material-symbols-outlined text-[16px]">
                  sync
                </span>
                Sync Now
              </Link>
            </div>
            <div className="w-16 h-16 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-3xl">
                cloud_done
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-500">Storage Used</span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {storageUsedGB} GB / 5 GB
            </span>
          </div>
        </div>
      </section>

      {/* ── Recommended for You ────────────────────────────────── */}
      <section className="px-5 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Recommended for You
          </h2>
          <Link
            to="/lessons"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400"
          >
            See All
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
          {LESSONS.filter((l) => l.progressPercent === 0)
            .slice(0, 4)
            .map((lesson) => {
              const meta = SUBJECT_META[lesson.subject];
              return (
                <Link
                  key={lesson.id}
                  to={`/tutor?subject=${lesson.subject}&lesson=${lesson.id}`}
                  className="min-w-[160px] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shrink-0"
                >
                  <div
                    className={`h-24 ${meta.bgColor} flex items-center justify-center`}
                  >
                    <span
                      className={`material-symbols-outlined text-4xl ${meta.color}`}
                    >
                      {meta.icon}
                    </span>
                  </div>
                  <div className="p-3">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider ${meta.color}`}
                    >
                      {meta.label}
                    </span>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5 line-clamp-1">
                      {lesson.title}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">
                        schedule
                      </span>
                      {lesson.durationMins}m
                    </p>
                  </div>
                </Link>
              );
            })}
        </div>
      </section>
    </div>
  );
}
