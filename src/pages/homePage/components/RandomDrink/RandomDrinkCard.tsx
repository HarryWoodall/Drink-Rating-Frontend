import { Skeleton } from "@/components/ui/skeleton";
import type { DrinkDetail } from "@/types/cocktail";
import { SectionHeading } from "../SectionHeading";
import { FavouriteButton } from "../../../../components/cocktail/favouriteButton/FavouriteButton";
import { ContentSkeleton } from "./ContentSkeleton";
import { RandomDrinkActions } from "./RandomDrinkActions";
import { RandomDrinkContent } from "./RandomDrinkContent";

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
              <ContentSkeleton />
            ) : (
              <RandomDrinkContent drink={drink} />
            )}

            <RandomDrinkActions
              drink={drink}
              fetching={fetching}
              onShuffle={onShuffle}
            ></RandomDrinkActions>
          </div>

          <div className="flex items-center justify-center">
            {loading || !drink ? (
              <Skeleton className="aspect-square w-full max-w-[360px] rounded-xl" />
            ) : (
              <div className="absolute">
                <img
                  src={drink.strDrinkThumb}
                  alt={drink.strDrink}
                  className="aspect-square w-full max-w-[360px] rounded-xl object-cover shadow-lg shadow-black/50"
                />
                <div className="absolute top-0 right-0 m-2">
                  <FavouriteButton cocktail={drink} readonly />
                </div>
              </div>
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
