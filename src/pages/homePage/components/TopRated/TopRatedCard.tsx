import { Link } from "react-router-dom";
import { ArrowUpRight, Wine } from "lucide-react";
import type { TopRatedResponse } from "@/types/cocktail";
import { cocktailPath } from "@/lib/paths";
import { StarRating } from "../StarRating";
import { DrinkDescription } from "../DrinkDescription";
import { DrinkIngredients } from "../DrinkIngredients";
import { FavouriteButton } from "@/components/cocktail/favouriteButton/FavouriteButton";

interface TopRatedCardProps {
  cocktail: TopRatedResponse;
}

export function TopRatedCard({ cocktail }: TopRatedCardProps) {
  return (
    <Link
      to={cocktailPath(cocktail.drink.idDrink)}
      className="group block overflow-hidden rounded-[1.6rem] border border-border bg-gradient-to-br from-card to-background shadow-2xl shadow-black/40 transition-colors hover:border-amber/45"
    >
      <div className="flex flex-col md:flex-row">
        <div className="relative h-60 w-full shrink-0 overflow-hidden md:h-auto md:w-80 relative">
          {cocktail.drink.strDrinkThumb ? (
            <img
              src={cocktail.drink.strDrinkThumb}
              alt={cocktail.drink.strDrink}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-black/30">
              <Wine className="h-12 w-12 text-amber/60" />
            </div>
          )}
          <div className="absolute top-0 right-0 m-2">
            <FavouriteButton cocktail={cocktail.drink} readonly />
          </div>
        </div>

        <div className="flex flex-col justify-center gap-3 p-8 md:p-10 w-full">
          <span className="text-[0.7rem] uppercase tracking-[0.4em] text-amber">
            Best in the house
          </span>

          <h3 className="font-serif text-6xl mb-2 font-normal italic leading-none">
            {cocktail.drink.strDrink}
          </h3>

          <DrinkDescription
            alcoholic={cocktail.drink.strAlcoholic}
            category={cocktail.drink.strCategory}
          />

          <div className="flex gap-3 mb-4">
            <StarRating
              rating={cocktail.avgRating}
              numRatings={cocktail.numRatings}
            />
          </div>

          <DrinkIngredients cocktail={cocktail.drink} />
          {cocktail.drink.strInstructions && (
            <p className="max-w-[48ch] text-sm leading-relaxed text-muted-foreground line-clamp-3">
              {cocktail.drink.strInstructions}
            </p>
          )}
          <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-amber transition-colors group-hover:text-amber-bright">
            Read the tasting notes
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
