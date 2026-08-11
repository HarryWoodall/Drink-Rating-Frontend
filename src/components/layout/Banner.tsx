import { Link, NavLink } from "react-router-dom";
import { ThemeToggle } from "../ThemeToggle";
import { favouritesPath } from "@/lib/paths";
import { authClient } from "@/lib/auth";
import { AuthItems } from "./AuthItems";

const navItems = [
  { to: "/#top", label: "Top Rated" },
  { to: "/#random", label: "Surprise Me" },
  { to: "/#trending", label: "Trending" },
  { to: favouritesPath(), label: "Favourites", authOnly: true },
];

export function Banner() {
  const { data: session } = authClient.useSession();

  return (
    <div className="mx-auto max-w-6xl px-7">
      <nav className="flex items-center justify-between py-7">
        <Link to="/" className="flex items-baseline gap-3 no-underline">
          <span className="font-serif text-3xl italic font-semibold tracking-tight">
            Night<span className="text-amber">cap</span>
          </span>
          <span className="hidden text-[0.62rem] uppercase tracking-[0.42em] text-muted-foreground sm:block mr-3">
            Cocktail Index
          </span>
          <ThemeToggle />
        </Link>

        <div className="flex items-center gap-8">
          <div className="hidden gap-8 text-xs uppercase tracking-[0.12em] text-muted-foreground sm:flex">
            {navItems
              .filter((item) => !item.authOnly || session)
              .map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className="transition-colors hover:text-amber"
                >
                  {item.label}
                </NavLink>
              ))}
          </div>
          <AuthItems />
        </div>
      </nav>
    </div>
  );
}
