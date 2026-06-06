import { Link } from "react-router-dom";
import { ArrowUpRight, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { CocktailDbDrink, CocktailDetail } from "@/types/cocktail";
import { cocktailPath } from "@/lib/paths";
import { SectionHeading } from "./SectionHeading";
import { DrinkDescription } from "./DrinkDescription";
import { DrinkIngredients } from "./DrinkIngredients";

interface RandomCocktailGridProps {
  drinks: CocktailDetail | null;
  loading: boolean;
  fetching?: boolean;
  error: string | null;
  onShuffle?: () => void;
}

export function RandomCocktailGrid({
  drinks: drink,
  loading,
  fetching,
  error,
  onShuffle,
}: RandomCocktailGridProps) {
  if (!drink) {
    return null;
  }

  return (
    <section id="random" className="scroll-mt-24 py-8">
      <SectionHeading
        num="01"
        title="Pour Me Something"
        blurb="Can't decide? Let the bar choose for you."
      />

      <div className="relative overflow-hidden rounded-[1.6rem] border border-border bg-gradient-to-br from-card to-background shadow-2xl shadow-black/40">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_400px] p-6">
          <div className="flex flex-col justify-center gap-3 p-8 md:p-10">
            <span className="text-[0.7rem] uppercase tracking-[0.4em] text-amber">
              Tonight's Wildcard
            </span>

            {error ? (
              <p className="text-sm text-destructive">
                Couldn't pour a wildcard right now. Try shuffling again.
              </p>
            ) : loading || !drink ? (
              <>
                <Skeleton className="h-10 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </>
            ) : (
              <>
                <h3 className="font-serif text-4xl font-normal italic leading-none">
                  {drink.strDrink}
                </h3>
                <DrinkDescription
                  alcoholic={drink.strAlcoholic}
                  category={drink.strCategory}
                />
                <div className="mt-4 max-w-[48ch]">
                  <DrinkIngredients cocktail={drink} />
                </div>

                {drink.strInstructions && (
                  <p className="max-w-[48ch] text-sm leading-relaxed text-muted-foreground line-clamp-3">
                    {drink.strInstructions}
                  </p>
                )}
              </>
            )}

            <div className="mt-3 flex flex-wrap gap-3">
              <Button
                onClick={onShuffle}
                disabled={fetching}
                className="group rounded-full"
              >
                <Shuffle
                  className={
                    fetching
                      ? "animate-spin"
                      : "transition-transform group-hover:rotate-180"
                  }
                />
                Shuffle Again
              </Button>
              {drink && (
                <Button asChild variant="outline" className="rounded-full">
                  <Link to={cocktailPath(drink.idDrink)}>
                    View &amp; Rate
                    <ArrowUpRight />
                  </Link>
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center">
            {loading || !drink ? (
              <Skeleton className="aspect-square w-full max-w-[360px] rounded-xl" />
            ) : (
              <img
                src={drink.strDrinkThumb}
                alt={drink.strDrink}
                className="aspect-square w-full max-w-[360px] rounded-xl object-cover shadow-lg shadow-black/50"
              />
            )}
          </div>
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(420px_400px_at_16%_50%,#d8a44b24,transparent_60%)]"
        />
      </div>
    </section>
  );
}
