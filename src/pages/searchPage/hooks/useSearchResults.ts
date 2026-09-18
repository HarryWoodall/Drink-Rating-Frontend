import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { AlcoholicFilter, SearchType } from "@/types/search";
import { DrinkCategory } from "../types/FilterTypes";
import {
  browseDrinks,
  searchCocktailsByIngredient,
  searchCocktailsByName,
} from "../services/searchService";

export type { SearchType, AlcoholicFilter } from "@/types/search";

export function useSearchResults(
  type: SearchType,
  filter: AlcoholicFilter,
  category: DrinkCategory,
  page: number,
  query?: string,
  limit?: number,
) {
  const isAlcoholic = filter === "all" ? undefined : filter === "alcoholic";

  const { data, isLoading, error } = useQuery({
    queryKey: ["search", type, query, isAlcoholic, category, page, limit],
    queryFn: getQuery(type, category, page, isAlcoholic, query, limit),
    placeholderData: keepPreviousData,
  });

  return {
    results: data,
    loading: isLoading,
    error: error ? (error as Error).message : null,
  };
}

function getQuery(
  type: SearchType,
  category: DrinkCategory,
  page: number,
  isAlcoholic?: boolean,
  query?: string,
  limit?: number,
) {
  if (!query) {
    return () => browseDrinks(isAlcoholic, category, page, limit);
  }

  if (type === "ingredient") {
    return () =>
      searchCocktailsByIngredient(query, isAlcoholic, category, page, limit);
  }

  return () => searchCocktailsByName(query, isAlcoholic, category, page, limit);
}
