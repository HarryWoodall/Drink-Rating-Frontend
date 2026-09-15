import { useSearchParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchBar } from "../../components/shared/layouts/SearchBar/SearchBar";
import { SearchFilters } from "./components/SearchFilters";
import { CocktailCard } from "@/components/shared/CocktailCard";
import {
  useSearchResults,
  type AlcoholicFilter,
  type SearchType,
} from "./hooks/useSearchResults";
import { useRouteHistoryStore } from "@/store/routeHistoryStore";
import { FormEvent, useEffect, useState } from "react";
import { SearchResultsPagination } from "./pagination/SearchResultsPagination";
import { DrinkSearchResponse } from "@/types/cocktail";
import { DrinkCategory } from "./types/FilterTypes";

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("q") ?? undefined;
  const type = (searchParams.get("type") ?? "name") as SearchType;
  const filter = (searchParams.get("filter") ?? "all") as AlcoholicFilter;
  // TODO - not yet passed to useSearchResults; the API has no category param.
  const category: DrinkCategory = (searchParams.get("category") ??
    "All") as DrinkCategory;
  const page = Number(searchParams.get("page") ?? 1);

  const { setPath } = useRouteHistoryStore((state) => state);
  const [searchQuery, setSearchQuery] = useState(query);

  useEffect(() => {
    setPath(location.pathname, "Back to search", location.search);
  }, [setPath, searchParams]);

  function updateParams(
    patch: Record<string, string | undefined>,
    replace = false,
  ) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        Object.entries(patch).forEach(([k, v]) => {
          if (v === undefined) {
            next.delete(k);
          } else {
            next.set(k, v);
          }
        });
        console.log(next);
        return next;
      },
      { replace },
    );
  }

  function handleSearchSubmit(e: FormEvent) {
    e.preventDefault();
    const formattedQuery = searchQuery?.trim();
    if (formattedQuery) {
      updateParams({ q: formattedQuery });
    } else {
      updateParams({ q: undefined });
    }
  }

  const { results, loading, error } = useSearchResults(
    type,
    filter,
    category,
    page,
    query,
  );

  console.log(results);

  if (!results) {
    return null;
  }

  return (
    <div className="py-8">
      <div className="mb-6 flex items-center gap-3.5 text-[0.7rem] uppercase tracking-[0.46em] text-amber">
        <span className="h-px w-12 bg-amber/60" />
        Search the cellar
      </div>

      <h1 className="mb-8 font-serif text-4xl font-light italic leading-none">
        Find your next pour.
      </h1>

      <SearchBar
        onChange={(q) => setSearchQuery(q)}
        onSubmit={handleSearchSubmit}
        defaultValue={query}
        type={type}
        onTypeChange={(t) => updateParams({ type: t, page: "1" }, true)}
      />

      <SearchFilters
        filter={filter}
        category={category}
        resultCount={results.pagination.totalResults}
        onFilterChange={(f) => updateParams({ filter: f, page: "1" }, true)}
        onCategoryChange={(c) => updateParams({ category: c, page: "1" }, true)}
      />
      <ResultsSection
        results={results}
        loading={loading}
        error={error}
        query={query}
      />
      <SearchResultsPagination
        currentPageNumber={page}
        totalPages={results.pagination.pages}
        offsetAmmount={2}
        onClick={(p) => updateParams({ page: p.toString() }, true)}
      />
    </div>
  );
}

function ResultsSection({
  results,
  loading,
  error,
  query,
}: {
  results: DrinkSearchResponse;
  loading: boolean;
  error: string | null;
  query: string | undefined;
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

  if (query && results.drinks.length === 0) {
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
      {results.drinks.map((drink) => (
        <CocktailCard key={drink.id} drink={drink} />
      ))}
    </div>
  );
}
