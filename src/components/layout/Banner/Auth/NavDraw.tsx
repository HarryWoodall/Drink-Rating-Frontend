import { authClient } from "@/lib/auth";
import { useLogout } from "./hooks/logoutHooks";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { Button } from "@/components/ui/button";
import { loginPath, profilePath } from "@/lib/paths";
import { User } from "@/types/cocktail";
import { Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { NavItem } from "./types/navTypes";

type NavDrawProps = {
  navItems: NavItem[];
};

export function NavDraw({ navItems }: NavDrawProps) {
  const { data: session } = authClient.useSession();
  const logout = useLogout();

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open menu">
          <Menu className="size-5" />
        </Button>
      </DrawerTrigger>

      <DrawerContent className="max-w-full">
        <DrawerHeader>
          <DrawerTitle className="sr-only">Menu</DrawerTitle>
          <DrawerDescription className="sr-only">
            Site navigation
          </DrawerDescription>
        </DrawerHeader>

        <DrawerClose asChild>
          <Button
            className="absolute top-5 right-5 rounded-full"
            variant="outline"
            size="icon"
          >
            <X />
          </Button>
        </DrawerClose>

        <nav className="flex flex-col px-4 mt-8">
          {navItems
            .filter((item) => !item.authOnly || session)
            .map((item) => (
              <DrawerClose asChild key={item.to}>
                <NavLink
                  to={item.to}
                  className="border-b border-border/40 py-4 text-xs uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-amber pr-32"
                >
                  {item.label}
                </NavLink>
              </DrawerClose>
            ))}

          {session ? (
            <DrawerClose asChild key="logout">
              <button
                onClick={logout}
                className="border-b border-border/40 py-4 text-left text-xs uppercase tracking-[0.16em] text-faded-foreground transition-colors hover:text-amber pr-32"
              >
                Log out
              </button>
            </DrawerClose>
          ) : (
            <DrawerClose asChild key="login">
              <NavLink
                to={loginPath()}
                className="border-b border-border/40 py-4 text-xs uppercase tracking-[0.16em] font-bold transition-colors hover:text-amber pr-32"
              >
                Log in
              </NavLink>
            </DrawerClose>
          )}
        </nav>

        <DrawerFooter className="mt-auto p-0 py-4 border-t border-border/40 mx-4">
          {session && (
            <DrawerClose asChild key="profile">
              <NavLink
                className="flex items-center gap-3 bg-muted rounded-sm p-1.5"
                to={profilePath()}
              >
                <UserAvatar user={session.user as User} size="lg" />
                <p className="text-faded-foreground text-xs">
                  {session.user.name}
                </p>
              </NavLink>
            </DrawerClose>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
