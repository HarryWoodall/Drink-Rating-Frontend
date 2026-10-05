import { CocktailCard } from "@/components/shared/CocktailCard";
import { Skeleton } from "@/components/ui/skeleton";
import { DrinkSearchResponse } from "@/types/cocktail";

type ResultsSectionProps = {
  results: DrinkSearchResponse;
  loading: boolean;
  error: string | null;
  query: string | undefined;
};

export function ResultsSection({
  results,
  loading,
  error,
  query,
}: ResultsSectionProps) {
  if (loading) {
    return (
      <div
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
        data-testid="search-results-loading"
      >
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
      <div
        className="rounded-[1.6rem] border border-destructive/40 bg-destructive/10 p-8 text-center"
        data-testid="search-results-error"
      >
        <p className="font-serif text-xl italic">Something went wrong</p>
        <p className="mt-2 text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (query && results.drinks.length === 0) {
    return (
      <div
        className="rounded-[1.6rem] border border-dashed border-border bg-black/15 py-20 text-center"
        data-testid="search-results-empty"
      >
        <p className="font-serif text-2xl italic">Nothing on the shelf</p>
        <p className="mt-2 text-sm text-muted-foreground">
          No results for &ldquo;{query}&rdquo;
        </p>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
      data-testid="search-results"
    >
      {results.drinks.map((drink) => (
        <CocktailCard key={drink.id} drink={drink} />
      ))}
    </div>
  );
}
