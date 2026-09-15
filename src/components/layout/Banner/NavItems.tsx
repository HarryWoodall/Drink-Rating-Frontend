import { NavLink } from "react-router-dom";
import { AuthItems } from "./Auth/AuthItems";
import { favouritesPath } from "@/lib/paths";
import { authClient } from "@/lib/auth";
import { NavDraw } from "./Auth/NavDraw";
import { NavItem } from "./Auth/types/navTypes";

const navItems: NavItem[] = [
  { to: "/search", label: "Browse" },
  { to: favouritesPath(), label: "Favourites", authOnly: true },
];

export function NavItems() {
  const { data: session } = authClient.useSession();

  return (
    <>
      <div className="md:hidden">
        <NavDraw navItems={navItems} />
      </div>

      <div className="hidden md:flex items-center gap-8">
        <div className="hidden gap-6 lg:gap-8 text-xs uppercase tracking-[0.12em] text-muted-foreground sm:flex">
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
    </>
  );
}
