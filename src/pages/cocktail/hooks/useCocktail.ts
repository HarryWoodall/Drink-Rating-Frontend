import { useQuery } from "@tanstack/react-query";
import { fetchCocktailById } from "@/services/api";

/** Loads the full CocktailDB drink for an individual cocktail page, by id. */
export function useCocktail(name: string | undefined) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["cocktail", name],
    queryFn: () => fetchCocktailById(name!),
    enabled: !!name,
  });

  return {
    cocktail: data ?? null,
    loading: isLoading,
    error: error ? (error as Error).message : null,
  };
}
