import { useQuery } from "@tanstack/react-query";
import { fetchCocktailByName } from "@/services/api";

/** Loads the full CocktailDB drink for an individual cocktail page, by name. */
export function useCocktail(name: string | undefined) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["cocktail", name],
    queryFn: () => fetchCocktailByName(name!),
    enabled: !!name,
  });

  return {
    cocktail: data ?? null,
    loading: isLoading,
    error: error ? (error as Error).message : null,
  };
}
