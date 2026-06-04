import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useCocktail } from "@/hooks/useCocktail";
import { extractIngredients } from "@/types/cocktail";
import { cn } from "@/lib/utils";

export function CocktailPage() {
  const { name } = useParams<{ name: string }>();
  const decoded = name ? decodeURIComponent(name) : undefined;
  const { cocktail, loading, error } = useCocktail(decoded);

  return (
    <div className="py-8">
      <Link
        to="/"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-amber"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to the index
      </Link>

      {loading ? (
        <LoadingState />
      ) : error || !cocktail ? (
        <div className="rounded-[1.6rem] border border-dashed border-border bg-black/15 py-20 text-center">
          <p className="font-serif text-2xl italic">Cocktail not found</p>
          <p className="mt-2 text-sm text-muted-foreground">
            We couldn't find “{decoded}” on the shelf.
          </p>
          <Button asChild variant="outline" className="mt-6 rounded-full">
            <Link to="/">Back to the index</Link>
          </Button>
        </div>
      ) : (
        <article className="overflow-hidden rounded-[1.6rem] border border-border bg-gradient-to-br from-card to-background shadow-2xl shadow-black/40">
          <div className="grid grid-cols-1 md:grid-cols-[320px_1fr]">
            <div className="border-b border-border bg-black/20 p-6 md:border-b-0 md:border-r">
              <img
                src={cocktail.strDrinkThumb}
                alt={cocktail.strDrink}
                className="aspect-square w-full rounded-xl object-cover shadow-lg shadow-black/50"
              />
            </div>

            <div className="p-8 md:p-10">
              <p className="text-[0.7rem] uppercase tracking-[0.24em] text-amber">
                {[cocktail.strCategory, cocktail.strAlcoholic, cocktail.strGlass]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              <h1 className="mt-2 font-serif text-5xl font-normal italic leading-none">
                {cocktail.strDrink}
              </h1>

              <h2 className="mt-8 mb-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Ingredients
              </h2>
              <ul className="flex flex-col gap-1.5">
                {extractIngredients(cocktail).map((ing) => (
                  <li
                    key={ing.name}
                    className="flex items-baseline justify-between gap-4 border-b border-border/60 pb-1.5 text-sm"
                  >
                    <span>{ing.name}</span>
                    {ing.measure && (
                      <span className="shrink-0 text-muted-foreground">
                        {ing.measure}
                      </span>
                    )}
                  </li>
                ))}
              </ul>

              {cocktail.strInstructions && (
                <>
                  <h2 className="mt-8 mb-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Method
                  </h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {cocktail.strInstructions}
                  </p>
                </>
              )}
            </div>
          </div>

          <RatingBar />
        </article>
      )}
    </div>
  );
}

function RatingBar() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  return (
    <div className="flex flex-wrap items-center justify-between gap-5 border-t border-border bg-black/20 p-8">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Your verdict
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {rating ? `You poured this ${rating} / 5` : "Tap a star to rate"}
        </p>
      </div>
      <div className="flex gap-1.5" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            type="button"
            aria-label={`Rate ${s} star${s > 1 ? "s" : ""}`}
            onMouseEnter={() => setHover(s)}
            onClick={() => setRating(s)}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={cn(
                "h-7 w-7",
                (hover || rating) >= s
                  ? "fill-amber text-amber"
                  : "fill-none text-amber/25",
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="overflow-hidden rounded-[1.6rem] border border-border bg-card">
      <div className="grid grid-cols-1 md:grid-cols-[320px_1fr]">
        <Skeleton className="h-72 w-full md:h-auto" />
        <div className="space-y-4 p-8 md:p-10">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-12 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  );
}
