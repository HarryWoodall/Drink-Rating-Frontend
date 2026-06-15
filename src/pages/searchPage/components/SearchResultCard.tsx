import { Link } from "react-router-dom";
import { Wine } from "lucide-react";
import { cocktailPath } from "@/lib/paths";
import type { CocktailDetail } from "@/types/cocktail";

interface SearchResultCardProps {
  drink: CocktailDetail;
}

export function SearchResultCard({ drink }: SearchResultCardProps) {
  return (
    <Link
      to={cocktailPath(drink.idDrink)}
      className="group flex flex-col overflow-hidden rounded-[1.6rem] border border-border bg-gradient-to-br from-card to-background transition-all hover:-translate-y-1 hover:border-amber/45 hover:shadow-lg hover:shadow-black/30"
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-black/20">
        {drink.strDrinkThumb ? (
          <img
            src={drink.strDrinkThumb}
            alt={drink.strDrink}
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
          {drink.strCategory}
        </p>
        <p className="mt-1 font-serif text-lg italic leading-snug">
          {drink.strDrink}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {drink.strAlcoholic}
        </p>
      </div>
    </Link>
  );
}
