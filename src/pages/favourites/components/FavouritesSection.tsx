import { FavouriteButton } from "@/components/cocktail/favouriteButton/FavouriteButton";
import { CocktailCard } from "@/components/shared/CocktailCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Drink } from "@/types/cocktail";

export function FavouritesSection({
  favourites,
  loading,
  error,
  query = "",
}: {
  favourites: Drink[];
  loading: boolean;
  error: Error | null;
  /** Active filter text, used to tell "no matches" apart from "none saved". */
  query?: string;
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-[1.6rem] border border-border bg-card"
          >
            <Skeleton className="aspect-[4/3] w-full rounded-none" />
            <div className="space-y-2 p-4">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[1.6rem] border border-destructive/40 bg-destructive/10 p-8 text-center">
        <p className="font-serif text-xl italic">Something went wrong</p>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  if (favourites.length === 0) {
    return (
      <div className="rounded-[1.6rem] border border-dashed border-border bg-black/15 py-20 text-center">
        <p className="font-serif text-2xl italic">
          {query ? "Nothing on the shelf" : "Nothing saved yet"}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {query ? (
            <>No favourites match &ldquo;{query}&rdquo;</>
          ) : (
            "Tap the heart on any cocktail to keep it here."
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {favourites.map((drink) => (
        <CocktailCard
          key={drink.id}
          drink={drink}
          action={
            <FavouriteButton
              cocktail={{ ...drink, favourite: drink.favourite ?? true }}
              size="sm"
            />
          }
        />
      ))}
    </div>
  );
}
