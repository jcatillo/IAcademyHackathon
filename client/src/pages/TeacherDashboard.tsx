export default function TeacherDashboard() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-primary p-6 text-center">
      <div className="card max-w-sm w-full p-12 space-y-6">
        <div className="text-6xl drop-shadow-sm">🏫</div>
        <h1 className="text-2xl font-bold tracking-tight text-text">Teacher Hub</h1>
        <p className="text-sm text-text-subtle font-medium leading-relaxed">
          The central hub for monitoring student progress and managing the local knowledge network.
        </p>
        <div className="pt-4 border-t border-border">
           <span className="text-[10px] font-bold text-accent uppercase tracking-[0.3em]">
             Authorized Access Only
           </span>
        </div>
      </div>
    </div>
  );
}
