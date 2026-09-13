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
      <div id="ingredient-showcase-panel" role="tabpanel" tabIndex={0}>
        {error ? (
          <p className="text-sm text-destructive">
            Failed to load the top drinks by ingredient.
          </p>
        ) : loading ? (
          <div className={GRID}>
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
          <div className="rounded-lg border border-dashed border-border bg-black/15 p-11 text-center">
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
            plugins={
              [
                //   Autoscroll({
                //     playOnInit: true,
                //     startDelay: 3000,
                //     stopOnInteraction: true,
                //     stopOnMouseEnter: true,
                //     speed: 1.5,
                //   }),
              ]
            }
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
    <CarouselItem className="basis-auto">
      <Link to={cocktailPath(d.id)!}>
        <DrinkShowcaseCard
          key={d.id}
          drink={d}
          avgRating={2.5} // TODO -- fix this to use actual data
          numRatings={3}
          ingredient="test"
        />
      </Link>
    </CarouselItem>
  ));
}
