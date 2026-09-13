import { Fragment } from "react";
import { FavouriteButton } from "@/components/cocktail/favouriteButton/FavouriteButton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Drink } from "@/types/cocktail";
import { StarRating } from "./StarRating";
import { cn } from "@/lib/utils";

type DrinkShowcaseCardProps = {
  drink: Drink;
  avgRating: number;
  numRatings: number;
  ingredient: string;
};

export function DrinkShowcaseCard({
  drink,
  avgRating,
  numRatings,
}: DrinkShowcaseCardProps) {
  return (
    <Card className="relative w-[200px] h-[300px] md:w-[300px] md:h-[350px] shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-card to-background shadow-2xl shadow-black/40">
      <div>
        <CardImage drink={drink} />
        <div className="flex flex-col p-3 md:p-4 justify-center gap-3">
          <CardHeader className="flex flex-col gap-1 md:gap-3 space-y-0 p-1 pb-2 md:p-0">
            <h3 className="font-serif text-xl font-normal italic leading-none">
              {drink.name}
            </h3>
          </CardHeader>

          <CardContent className="flex flex-col gap-3 p-1 md:px-6 pb-0 md:pb-3 md:p-0">
            <StarRating rating={avgRating} numRatings={numRatings} />
          </CardContent>

          <CardFooter className="p-0 text-xs">
            <DrinkIngredients drink={drink} />
          </CardFooter>
        </div>
      </div>
    </Card>
  );
}

interface CardImageProps {
  // TODO - maybe take this out into a seperate file
  drink: Drink;
}

function CardImage({ drink }: CardImageProps) {
  return (
    <>
      <img
        src={drink.image}
        alt={drink.name}
        className="w-full max-h-32 md:max-h-48 object-cover"
      />
      <div className="absolute top-0 right-0 m-2">
        <FavouriteButton cocktail={drink} readonly />
      </div>
    </>
  );
}

interface DrinkIngredientsProps {
  drink: Drink;
}

export function DrinkIngredients({ drink }: DrinkIngredientsProps) {
  return (
    <p
      className={cn(
        "text-[0.8em] italic uppercase tracking-[0.16em] text-faded-foreground",
      )}
    >
      {drink.ingredients
        .sort((a, b) => (b.searchItems ? 1 : 0) - (a.searchItems ? 1 : 0))
        .map((x, index) => (
          <Fragment key={x.name}>
            {index > 0 && <span className="font-extrabold"> · </span>}
            <span className={cn(index === 0 && "font-bold text-amber-bright")}>
              {x.name}
            </span>
          </Fragment>
        ))}
    </p>
  );
}
