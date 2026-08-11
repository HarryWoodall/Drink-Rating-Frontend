import { useSearchParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchBar } from "./components/SearchBar";
import { SearchFilters } from "./components/SearchFilters";
import { SearchResultCard } from "./components/SearchResultCard";
import {
  useSearchResults,
  type AlcoholicFilter,
  type SearchType,
} from "./hooks/useSearchResults";
import { useRouteHistoryStore } from "@/store/routeHistoryStore";
import { useEffect } from "react";

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("q") ?? "";
  const type = (searchParams.get("type") ?? "name") as SearchType;
  const filter = (searchParams.get("filter") ?? "all") as AlcoholicFilter;

  const { setPath } = useRouteHistoryStore((state) => state);

  useEffect(() => {
    setPath(location.pathname, "Back to search", location.search);
  }, [setPath, searchParams]);

  function updateParams(patch: Record<string, string>, replace = false) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        Object.entries(patch).forEach(([k, v]) => next.set(k, v));
        console.log(next);
        return next;
      },
      { replace },
    );
  }

  const { results, loading, error } = useSearchResults(query, type, filter);

  return (
    <div className="py-8">
      <div className="mb-6 flex items-center gap-3.5 text-[0.7rem] uppercase tracking-[0.46em] text-amber">
        <span className="h-px w-12 bg-amber/60" />
        Search the cellar
      </div>

      <h1 className="mb-8 font-serif text-4xl font-light italic leading-none">
        Find your next pour.
      </h1>

      <SearchBar defaultValue={query} onSubmit={(q) => updateParams({ q })} />

      {query ? (
        <>
          <SearchFilters
            type={type}
            filter={filter}
            resultCount={results.length}
            onTypeChange={(t) => updateParams({ type: t }, true)}
            onFilterChange={(f) => updateParams({ filter: f }, true)}
          />
          <ResultsSection
            results={results}
            loading={loading}
            error={error}
            query={query}
          />
        </>
      ) : (
        <EmptyPrompt />
      )}
    </div>
  );
}

function ResultsSection({
  results,
  loading,
  error,
  query,
}: {
  results: ReturnType<typeof useSearchResults>["results"];
  loading: boolean;
  error: string | null;
  query: string;
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
        <p className="mt-2 text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="rounded-[1.6rem] border border-dashed border-border bg-black/15 py-20 text-center">
        <p className="font-serif text-2xl italic">Nothing on the shelf</p>
        <p className="mt-2 text-sm text-muted-foreground">
          No results for &ldquo;{query}&rdquo;
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {results.map((drink) => (
        <SearchResultCard key={drink.idDrink} drink={drink} />
      ))}
    </div>
  );
}

function EmptyPrompt() {
  return (
    <div className="mt-16 text-center">
      <div className="mb-3 flex items-center justify-center gap-3.5 text-[0.7rem] uppercase tracking-[0.46em] text-amber">
        <span className="h-px w-8 bg-amber/60" />
        Ready when you are
        <span className="h-px w-8 bg-amber/60" />
      </div>
      <p className="font-serif text-3xl font-light italic text-muted-foreground">
        What are you in the mood for?
      </p>
    </div>
  );
}
