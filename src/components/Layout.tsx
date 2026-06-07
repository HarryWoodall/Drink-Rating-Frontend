import { Link, NavLink, Outlet } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { loginPath, registerPath } from "@/lib/paths";

const navItems = [
  { to: "/#top", label: "Top Rated" },
  { to: "/#random", label: "Surprise Me" },
  { to: "/#trending", label: "Trending" },
];

export function Layout() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-7">
        <nav className="flex items-center justify-between py-7">
          <Link to="/" className="flex items-baseline gap-3 no-underline">
            <span className="font-serif text-3xl italic font-semibold tracking-tight">
              Night<span className="text-amber">cap</span>
            </span>
            <span className="hidden text-[0.62rem] uppercase tracking-[0.42em] text-muted-foreground sm:block">
              Cocktail Index
            </span>
          </Link>

          <div className="flex items-center gap-8">
            <div className="hidden gap-8 text-xs uppercase tracking-[0.12em] text-muted-foreground sm:flex">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className="transition-colors hover:text-amber"
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
            {isAuthenticated ? (
              <div className="hidden items-center gap-4 sm:flex">
                <span className="text-xs text-muted-foreground">{user?.name ?? user?.email}</span>
                <button
                  onClick={logout}
                  className="text-xs uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-amber"
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className="hidden items-center gap-4 sm:flex">
                <Link
                  to={loginPath()}
                  className="text-xs uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-amber"
                >
                  Log in
                </Link>
                <Link
                  to={registerPath()}
                  className="rounded-full bg-amber px-4 py-2 text-xs font-semibold text-background transition-opacity hover:opacity-80"
                >
                  Sign up
                </Link>
              </div>
            )}
            <ThemeToggle />
          </div>
        </nav>
      </div>

      <main className="mx-auto max-w-6xl px-7">
        <Outlet />
      </main>

      <footer className="mx-auto mt-16 max-w-6xl px-7 pb-16 pt-10 text-center">
        <div className="mb-2 font-serif text-lg italic text-amber">
          Drink curiously.
        </div>
        <p className="text-xs uppercase tracking-[0.1em] text-muted-foreground">
          Nightcap — a community cocktail index · please sip responsibly
        </p>
      </footer>
    </div>
  );
}
