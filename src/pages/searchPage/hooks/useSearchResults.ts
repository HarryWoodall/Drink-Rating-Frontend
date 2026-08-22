import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  searchCocktailsByIngredient,
  searchCocktailsByName,
} from "@/services/api";

export type SearchType = "name" | "ingredient";
export type AlcoholicFilter = "all" | "alcoholic" | "non-alcoholic";

export function useSearchResults(
  query: string,
  type: SearchType,
  filter: AlcoholicFilter,
) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["search", type, query],
    queryFn:
      type === "ingredient"
        ? () => searchCocktailsByIngredient(query)
        : () => searchCocktailsByName(query),
    enabled: query.trim().length > 0,
  });

  const results = useMemo(() => {
    if (!data) return [];
    if (filter === "all") return data;
    if (filter === "alcoholic")
      return data.filter((d) => d.alcoholic);
    return data.filter((d) => !d.alcoholic);
  }, [data, filter]);

  return {
    results,
    loading: isLoading,
    error: error ? (error as Error).message : null,
  };
}
