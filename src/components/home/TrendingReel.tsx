import { Link } from "react-router-dom";
import { Flame } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { DbCocktail, TrendingResponse } from "@/types/cocktail";
import { cocktailPath } from "@/lib/paths";
import { SectionHeading } from "./SectionHeading";
import { StarRating } from "./StarRating";

interface TrendingReelProps {
  cocktails: TrendingResponse[];
  loading: boolean;
  error: string | null;
}

/**
 * Derive a stable "people watching now" count from the cocktail so the reel
 * reads like a live trending feed. When the backend exposes a real view-count
 * endpoint, swap this for that field.
 */
function watchers(c: TrendingResponse): number {
  return 3 + ((200 * 7 + Math.round(c.averageRating.avgRating * 5)) % 42); // wtf??
}

export function TrendingReel({ cocktails, loading, error }: TrendingReelProps) {
  return (
    <section id="trending" className="scroll-mt-24 py-8">
      <SectionHeading
        num="03"
        title="Trending at the Bar"
        blurb="What the room is sipping right now."
      />

      {error && (
        <p className="text-sm text-destructive">
          Failed to load trending pours.
        </p>
      )}

      <div className="reel-scroll flex gap-4 overflow-x-auto pb-4 pt-1">
        {loading ? (
          Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className="w-[200px] shrink-0 overflow-hidden rounded-2xl border border-border bg-card"
            >
              <Skeleton className="h-28 w-full" />
              <div className="space-y-2 p-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))
        ) : cocktails.length === 0 ? (
          <div className="w-full rounded-2xl border border-dashed border-border bg-black/15 p-10 text-center text-sm text-muted-foreground">
            Nothing trending yet — be the first to pour one.
          </div>
        ) : (
          cocktails.map((c) => (
            <Link
              key={c.drink.idDrink}
              to={cocktailPath(c.drink.strDrink)}
              className="group w-[200px] shrink-0 overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:border-amber/45"
            >
              <div
                className="relative flex h-28 items-end justify-between gap-2 overflow-hidden bg-cover bg-center p-4"
                style={{ backgroundImage: `url(${c.drink.strDrinkThumb})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-card/30 to-background/70" />
                <span className="relative z-10 dark:text-amber-bright font-serif text-2xl italic leading-tight">
                  {c.drink.strDrink}
                </span>
              </div>
              <div className="border-t border-border p-4">
                <StarRating
                  rating={c.averageRating.avgRating}
                  showValue={false}
                  numRatings={c.averageRating.numRatings}
                  size="sm"
                />
                <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-amber" />
                  </span>
                  {watchers(c)} watching now
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
