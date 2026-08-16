import { FavouriteButton } from "@/components/cocktail/favouriteButton/FavouriteButton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { DrinkDetail } from "@/types/cocktail";
import { SectionHeading } from "../SectionHeading";
import { ContentSkeleton } from "./ContentSkeleton";
import { RandomDrinkActions } from "./RandomDrinkActions";
import { RandomDrinkDetails, RandomDrinkHeading } from "./RandomDrinkContent";

interface RandomDrinkProps {
  drink: DrinkDetail | null;
  loading: boolean;
  fetching?: boolean;
  error: string | null;
  onShuffle?: () => void;
}

export function RandomDrink({
  drink: drink,
  loading,
  fetching,
  error,
  onShuffle,
}: RandomDrinkProps) {
  if (!drink) {
    return null;
  }

  const showDetails = !error && !loading;

  return (
    <section id="random" className="scroll-mt-24 py-8">
      <SectionHeading
        num="01"
        title="Pour Me Something"
        blurb="Can't decide? Let the bar choose for you."
      />

      <Card className="relative overflow-hidden rounded-[1.6rem] bg-gradient-to-br from-card to-background shadow-2xl shadow-black/40 md:p-10 md:pr-0">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_400px]">
          {/* Card sections carry their own p-6; the column owns the padding so
              the original gap-3 rhythm between all the rows is preserved. */}
          <div className="flex flex-col justify-center gap-3 md:p-10">
            <div className="md:hidden">
              <CardImage drink={drink} />
            </div>

            <CardHeader className="flex flex-col gap-1 md:gap-3 space-y-0 p-6 pb-2 md:p-0">
              <span className="text-[0.65rem] md:text-[0.7rem] uppercase tracking-[0.4em] text-amber mb-2 md:mb-0">
                Tonight's Wildcard
              </span>

              {error ? (
                <p className="text-sm text-destructive">
                  Couldn't pour a wildcard right now. Try shuffling again.
                </p>
              ) : loading ? (
                <ContentSkeleton />
              ) : (
                <RandomDrinkHeading drink={drink} />
              )}
            </CardHeader>

            {showDetails && (
              <CardContent className="flex flex-col gap-3 px-6 pb-0 md:pb-3 md:p-0">
                <RandomDrinkDetails drink={drink} />
              </CardContent>
            )}

            <CardFooter className="pb-6 md:pb-0">
              <RandomDrinkActions
                drink={drink}
                fetching={fetching}
                onShuffle={onShuffle}
              />
            </CardFooter>
          </div>

          <div className="flex items-center justify-center">
            {loading ? (
              <Skeleton className="aspect-square w-full max-w-[360px] rounded-xl" />
            ) : (
              <div className="absolute hidden md:block">
                <CardImage drink={drink} />
              </div>
            )}
          </div>
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(420px_400px_at_16%_50%,#d8a44b24,transparent_60%)]"
        />
      </Card>
    </section>
  );
}

interface CardImageProps {
  drink: DrinkDetail;
}

function CardImage({ drink }: CardImageProps) {
  return (
    <>
      <img
        src={drink.strDrinkThumb}
        alt={drink.strDrink}
        className="md:aspect-square w-full max-h-[200px] sm:max-h-[300px] md:max-h-full md:max-w-[360px] md:rounded-xl object-cover md:shadow-lg md:shadow-black/50"
      />
      <div className="absolute top-0 right-0 m-2">
        <FavouriteButton cocktail={drink} readonly />
      </div>
    </>
  );
}
