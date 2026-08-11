import { Link } from "react-router-dom";
import { Wine } from "lucide-react";
import type { TopRatedResponse } from "@/types/cocktail";
import { cocktailPath } from "@/lib/paths";
import { StarRating } from "../StarRating";
import { FavouriteButton } from "@/components/cocktail/favouriteButton/FavouriteButton";

interface RatedCardProps {
  topRatedResponse: TopRatedResponse;
  number: number;
}

export function RatedCard({ topRatedResponse, number }: RatedCardProps) {
  if (!topRatedResponse) {
    return null;
  }

  return (
    <Link
      to={cocktailPath(topRatedResponse.drink.idDrink)}
      className="group block overflow-hidden rounded-[1.2rem] border border-border bg-gradient-to-br from-card to-background shadow-2xl shadow-black/40 transition-colors hover:border-amber/45"
    >
      <div className="flex flex-row-reverse md:flex-row">
        <div className="relative h-30 w-20 shrink-0 overflow-hidden md:h-auto md:w-40 relative">
          {topRatedResponse.drink.strDrinkThumb ? (
            <img
              src={topRatedResponse.drink.strDrinkThumb}
              alt={topRatedResponse.drink.strDrink}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-black/30">
              <Wine className="h-12 w-12 text-amber/60" />
            </div>
          )}
          <div className="absolute top-0 right-0 m-2">
            <FavouriteButton
              cocktail={topRatedResponse.drink}
              readonly
              size="sm"
            />
          </div>
        </div>

        <div className="flex flex-col justify-center gap-3 p-5 md:p-6">
          <div className="flex gap-3 items-center">
            <span className="font-serif text-amber text-2xl">{number}.</span>
            <h3 className="font-serif text-xl font-normal italic leading-none">
              {topRatedResponse.drink.strDrink}
            </h3>
          </div>

          <div className="flex gap-3">
            <StarRating
              size="sm"
              rating={topRatedResponse.avgRating}
              numRatings={topRatedResponse.numRatings}
            />
          </div>

          {topRatedResponse.drink.strInstructions && (
            <p className="max-w-[48ch] text-sm leading-relaxed text-muted-foreground line-clamp-2">
              {topRatedResponse.drink.strInstructions}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
