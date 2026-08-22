import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Wine } from "lucide-react";
import { cocktailPath } from "@/lib/paths";
import { alcoholicLabel, type Drink } from "@/types/cocktail";

interface CocktailCardProps {
  drink: Drink;
  /**
   * Optional control pinned to the top-right of the thumbnail. Rendered as a
   * sibling of the link rather than inside it, so an interactive action (a
   * favourite button, say) isn't nested in an anchor.
   */
  action?: ReactNode;
}

export function CocktailCard({ drink, action }: CocktailCardProps) {
  return (
    <div className="relative">
      <Link
        to={cocktailPath(drink.id)}
        className="group flex h-full flex-col overflow-hidden rounded-[1.6rem] border border-border bg-gradient-to-br from-card to-background transition-all hover:border-amber/45 hover:shadow-lg hover:shadow-black/30"
      >
        <div className="aspect-[4/3] w-full overflow-hidden bg-black/20">
          {drink.image ? (
            <img
              src={drink.image}
              alt={drink.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Wine className="h-12 w-12 text-muted-foreground/30" />
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-4">
          <p className="text-[0.65rem] uppercase tracking-[0.24em] text-amber">
            {drink.category}
          </p>
          <p className="mt-1 font-serif text-lg italic leading-snug">
            {drink.name}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {alcoholicLabel(drink.alcoholic)}
          </p>
        </div>
      </Link>

      {action ? (
        <div className="absolute right-0 top-0 z-10 m-2">{action}</div>
      ) : null}
    </div>
  );
}
