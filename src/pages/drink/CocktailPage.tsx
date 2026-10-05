import { Link, useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useCocktail } from "@/pages/drink/hooks/useCocktail";
import { alcoholicLabel } from "@/types/cocktail";
import { CommentSection } from "@/components/cocktail/comments/CommentSection";
import { useRoomEvents } from "@/pages/drink/hooks/useEvents";
import { cocktailPageEvents } from "@/lib/paths";
import { BackLink } from "@/components/shared/BackLink";
import { useRouteHistoryStore } from "@/store/routeHistoryStore";
import { useEffect } from "react";
import { FavouriteButton } from "@/components/cocktail/favouriteButton/FavouriteButton";
import { StarRating } from "../homePage/components/StarRating";

export function CocktailPage() {
  const { name } = useParams<{ name: string }>();
  const decoded = name ? decodeURIComponent(name) : undefined;
  const { cocktail, loading, error } = useCocktail(decoded);
  const [users] = useRoomEvents(cocktailPageEvents(decoded));
  const { setPath } = useRouteHistoryStore((state) => state);

  useEffect(() => {
    setPath(location.pathname, "Back to cocktail");
  }, [setPath]);

  return (
    <div className="py-8">
      <div className="flex justify-between mb-8 ">
        <BackLink />
        {users.length > 1 ? (
          <div
            className="flex justify-center items-center gap-1.5 animate-in fade-in zoom-in fade-out zoom-out"
            data-testid="cocktail-page-watching"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber" />
            </span>
            <p className="text-sm text-primary m-0 p-0">
              {users.length} watching now
            </p>
          </div>
        ) : null}
      </div>

      {loading ? (
        <LoadingState />
      ) : error || !cocktail ? (
        <div
          className="rounded-[1.6rem] border border-dashed border-border bg-black/15 py-20 text-center"
          data-testid="cocktail-page-not-found"
        >
          <p className="font-serif text-2xl italic">Cocktail not found</p>
          <p className="mt-2 text-sm text-muted-foreground">
            We couldn't find “{decoded}” on the shelf.
          </p>
          <Button asChild variant="outline" className="mt-6 rounded-full">
            <Link to="/" data-testid="cocktail-page-not-found-home-link">
              Back to the index
            </Link>
          </Button>
        </div>
      ) : (
        <article
          className="overflow-hidden rounded-[1.6rem] border border-border bg-gradient-to-br from-card to-background shadow-2xl shadow-black/40"
          data-testid="cocktail-page-drink"
        >
          <div className="grid grid-cols-1 md:grid-cols-[320px_1fr]">
            <div className="border-b border-border bg-black/20 p-6 md:border-b-0 md:border-r">
              <img
                src={cocktail.image}
                alt={cocktail.name}
                className="aspect-square w-full rounded-xl object-cover shadow-lg shadow-black/50"
                data-testid="cocktail-page-image"
              />
            </div>

            <div className="p-8 md:p-10">
              <p
                className="text-[0.7rem] uppercase tracking-[0.24em] text-amber"
                data-testid="cocktail-page-meta"
              >
                {[
                  cocktail.category,
                  alcoholicLabel(cocktail.alcoholic),
                  cocktail.glass,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              <div className="flex justify-between items-center">
                <h1
                  className="mt-2 font-serif text-5xl font-normal italic leading-none"
                  data-testid="cocktail-page-name"
                >
                  {cocktail.name}
                </h1>
                <FavouriteButton cocktail={cocktail} />
              </div>

              <div className="mt-3">
                {cocktail.rating ? (
                  <StarRating rating={cocktail.rating.avgRating} size="md" />
                ) : (
                  <p className="font-serif italic text-muted-foreground text-md">
                    No ratings yet
                  </p>
                )}
              </div>

              <h2 className="mt-8 mb-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Ingredients
              </h2>
              <ul
                className="flex flex-col gap-1.5"
                data-testid="cocktail-page-ingredients"
              >
                {cocktail.ingredients.map((ing) => (
                  <li
                    key={ing.name}
                    className="flex items-baseline justify-between gap-4 border-b border-border/60 pb-1.5 text-sm"
                    data-testid="cocktail-page-ingredient"
                  >
                    <span data-testid="cocktail-page-ingredient-name">
                      {ing.name}
                    </span>
                    {ing.measure && (
                      <span
                        className="shrink-0 text-muted-foreground"
                        data-testid="cocktail-page-ingredient-measure"
                      >
                        {ing.measure}
                      </span>
                    )}
                  </li>
                ))}
              </ul>

              {cocktail.instructions && (
                <>
                  <h2 className="mt-8 mb-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Method
                  </h2>
                  <p
                    className="text-sm leading-relaxed text-muted-foreground"
                    data-testid="cocktail-page-method"
                  >
                    {cocktail.instructions}
                  </p>
                </>
              )}
            </div>
          </div>
          <CommentSection drinkId={cocktail.id} />
        </article>
      )}
    </div>
  );
}

function LoadingState() {
  return (
    <div
      className="overflow-hidden rounded-[1.6rem] border border-border bg-card"
      data-testid="cocktail-page-loading"
    >
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
