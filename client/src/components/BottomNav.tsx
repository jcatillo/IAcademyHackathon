import { NavLink } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/", icon: "home", label: "Home" },
  { to: "/lessons", icon: "menu_book", label: "Lessons" },
  { to: "/tutor", icon: "psychology", label: "Tutor" },
  { to: "/profile", icon: "person", label: "Profile" },
] as const;

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-white dark:bg-slate-900 border-t-2 border-slate-200 dark:border-slate-700 pb-[env(safe-area-inset-bottom)]">
      <ul className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {NAV_ITEMS.map(({ to, icon, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors ${
                  isActive
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`material-symbols-outlined text-[24px] ${
                      isActive ? "font-bold" : ""
                    }`}
                  >
                    {icon}
                  </span>
                  <span
                    className={`text-[10px] font-semibold ${
                      isActive ? "text-blue-600 dark:text-blue-400" : ""
                    }`}
                  >
                    {label}
                  </span>
                  {isActive && (
                    <span className="absolute -top-0.5 w-8 h-1 rounded-full bg-blue-600 dark:bg-blue-400" />
                  )}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
