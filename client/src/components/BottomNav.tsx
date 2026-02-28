import { NavLink } from "react-router-dom";
import { Home, BookOpen, Brain, User } from "lucide-react";

const NAV_ITEMS = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/lessons", icon: BookOpen, label: "Lessons" },
  { to: "/tutor", icon: Brain, label: "Tutor" },
  { to: "/profile", icon: User, label: "Profile" },
] as const;

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-white border-t border-border pb-[env(safe-area-inset-bottom)] shadow-sm">
      <ul className="flex justify-around items-center h-16 max-w-lg mx-auto px-4">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `relative flex flex-col items-center gap-1 py-2 transition-all duration-200 ${
                  isActive
                    ? "text-accent"
                    : "text-text-subtle hover:text-text"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={24}
                    strokeWidth={isActive ? 2.5 : 2}
                    className="transition-transform duration-200"
                  />
                  <span
                    className={`text-[10px] font-medium tracking-tight ${
                      isActive ? "font-semibold" : ""
                    }`}
                  >
                    {label}
                  </span>
                  {isActive && (
                    <span className="absolute top-0 w-8 h-0.5 bg-accent rounded-full transition-all" />
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
