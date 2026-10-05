import { Skeleton } from "@/components/ui/skeleton";
import { Drink, TopIngredient } from "@/types/cocktail";
import { DrinkShowcaseCard } from "../DrinkShowcaseCard";
import { useCocktailsFromIngredient } from "./hooks/ingredientShowcaseHooks";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cocktailPath } from "@/lib/paths";
import { Link } from "react-router-dom";

type CocktailListProps = {
  picked: TopIngredient;
};

export function IngredientDrinkList({ picked }: CocktailListProps) {
  const GRID = "grid gap-4 md:grid-cols-[1.35fr_1fr_1fr]";

  const { drinks, loading, error } = useCocktailsFromIngredient(picked);

  if (picked === undefined) return null;

  return (
    <>
      <div
        id="ingredient-showcase-panel"
        role="tabpanel"
        tabIndex={0}
        data-testid="ingredient-drink-list"
      >
        {error ? (
          <p
            className="text-sm text-destructive"
            data-testid="ingredient-drink-list-error"
          >
            Failed to load the top drinks by ingredient.
          </p>
        ) : loading ? (
          <div className={GRID} data-testid="ingredient-drink-list-loading">
            {Array.from({ length: 3 }, (_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-lg border border-border bg-card"
              >
                <Skeleton className="h-48 w-full" />
                <div className="space-y-2 p-4">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : !drinks || drinks.length === 0 ? (
          <div
            className="rounded-lg border border-dashed border-border bg-black/15 p-11 text-center"
            data-testid="ingredient-drink-list-empty"
          >
            <p className="text-sm text-muted-foreground">
              No one has rated a {picked.name.toLowerCase()} drink yet.
            </p>
          </div>
        ) : (
          <Carousel
            opts={{
              loop: false,
              dragFree: true,
              align: "center",
            }}
            className=""
          >
            <CarouselContent>
              <ShowcaseContent drinks={drinks} />
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        )}
      </div>
    </>
  );
}

interface ContentShowcaseProps {
  drinks: Drink[];
}

function ShowcaseContent({ drinks }: ContentShowcaseProps) {
  return drinks.map((d) => (
    <CarouselItem className="basis-auto" key={d.id}>
      <Link to={cocktailPath(d.id)!} data-testid="ingredient-drink-list-link">
        <DrinkShowcaseCard
          key={d.id}
          drink={d}
          avgRating={d.rating?.avgRating ?? 0}
          numRatings={d.rating?.numRatings ?? 0}
        />
      </Link>
    </CarouselItem>
  ));
}
