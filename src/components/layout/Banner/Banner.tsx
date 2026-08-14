import { cn } from "@/lib/utils";
import { Header } from "./Header";
import { NavItems } from "./NavItems";
import { useScrolled } from "./hooks/useScrolled";

export function Banner() {
  const scrolled = useScrolled();

  return (
    <div
      className={cn(
        "mx-auto max-w-6xl px-7 fixed md:static w-full z-50 transition-colors duration-200",
        // the bar only overlaps content while it's fixed (below md), so the
        // scrolled background is mobile-only
        scrolled &&
          "bg-background/85 backdrop-blur border-b border-border md:bg-transparent md:backdrop-blur-none md:border-0",
      )}
    >
      <nav className="flex items-center justify-between py-4">
        <Header />
        <NavItems />
      </nav>
    </div>
  );
}
