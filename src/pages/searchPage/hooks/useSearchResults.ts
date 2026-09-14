import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  searchCocktailsByIngredient,
  searchCocktailsByName,
} from "@/services/api";
import type { AlcoholicFilter, SearchType } from "@/types/search";

export type { SearchType, AlcoholicFilter } from "@/types/search";

export function useSearchResults(
  query: string,
  type: SearchType,
  filter: AlcoholicFilter,
  page: number,
  limit?: number,
) {
  const isAlcoholic = filter === "all" ? undefined : filter === "alcoholic";

  const { data, isLoading, error } = useQuery({
    queryKey: ["search", type, query, isAlcoholic, page, limit],
    queryFn:
      type === "ingredient"
        ? () => searchCocktailsByIngredient(query, isAlcoholic, page, limit)
        : () => searchCocktailsByName(query, isAlcoholic, page, limit),
    enabled: query.trim().length > 0,
    placeholderData: keepPreviousData,
  });

  return {
    results: data,
    loading: isLoading,
    error: error ? (error as Error).message : null,
  };
}
