import { ThemeToggle } from "@/components/ThemeToggle";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <Link to="/" className="flex items-baseline gap-3 no-underline">
      <span className="font-serif text-3xl md:text-xl lg:text-3xl italic font-semibold tracking-tight">
        Night<span className="text-amber">cap</span>
      </span>
      <span className="hidden text-[0.62rem] uppercase tracking-[0.42em] text-muted-foreground lg:block mr-3">
        Cocktail Index
      </span>
      <ThemeToggle />
    </Link>
  );
}
