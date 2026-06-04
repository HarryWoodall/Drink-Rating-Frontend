import { Link } from "react-router-dom";
import { ArrowUpRight, Wine } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { EnrichedCocktail } from "@/types/cocktail";
import { cocktailPath } from "@/lib/paths";
import { SectionHeading } from "./SectionHeading";
import { StarRating } from "./StarRating";

interface TopRatedCardProps {
  cocktail: EnrichedCocktail | null;
  loading: boolean;
  error: string | null;
}

export function TopRatedCard({ cocktail, loading, error }: TopRatedCardProps) {
  return (
    <section id="top" className="scroll-mt-24 py-8">
      <SectionHeading
        num="02"
        title="The Top Shelf"
        blurb="The highest-rated pour, as voted by the room."
      />

      {error ? (
        <p className="text-sm text-destructive">
          Failed to load the top-rated cocktail.
        </p>
      ) : loading ? (
        <div className="overflow-hidden rounded-[1.6rem] border border-border bg-card">
          <div className="flex flex-col md:flex-row">
            <Skeleton className="h-60 w-full md:h-auto md:w-80 shrink-0" />
            <div className="flex flex-1 flex-col gap-3 p-8">
              <Skeleton className="h-9 w-2/3" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        </div>
      ) : !cocktail ? (
        <div className="rounded-[1.6rem] border border-dashed border-border bg-black/15 py-16 text-center">
          <Wine className="mx-auto mb-3 h-9 w-9 text-amber/60" />
          <p className="font-medium">No cocktails rated yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Be the first to leave your verdict.
          </p>
        </div>
      ) : (
        <Link
          to={cocktailPath(cocktail.name)}
          className="group block overflow-hidden rounded-[1.6rem] border border-border bg-gradient-to-br from-card to-background shadow-2xl shadow-black/40 transition-colors hover:border-amber/45"
        >
          <div className="flex flex-col md:flex-row">
            <div className="relative h-60 w-full shrink-0 overflow-hidden md:h-auto md:w-80">
              {cocktail.thumbUrl ? (
                <img
                  src={cocktail.thumbUrl}
                  alt={cocktail.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-black/30">
                  <Wine className="h-12 w-12 text-amber/60" />
                </div>
              )}
              <span className="absolute left-4 top-3 font-serif text-3xl italic text-amber drop-shadow">
                01
              </span>
            </div>

            <div className="flex flex-col justify-center gap-3 p-8 md:p-10">
              <span className="text-[0.7rem] uppercase tracking-[0.4em] text-amber">
                Best in the house
              </span>
              <h3 className="font-serif text-4xl font-normal italic leading-none">
                {cocktail.name}
              </h3>
              <StarRating rating={cocktail.rating} />
              {cocktail.description && (
                <p className="max-w-[48ch] text-sm leading-relaxed text-muted-foreground line-clamp-3">
                  {cocktail.description}
                </p>
              )}
              <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-amber transition-colors group-hover:text-amber-bright">
                Read the tasting notes
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </Link>
      )}
    </section>
  );
}
