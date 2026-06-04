import { useQuery } from "@tanstack/react-query";
import { fetchRandomCocktails } from "@/services/api";

export function useRandomCocktails(count = 6) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["randomCocktails", count],
    queryFn: () => fetchRandomCocktails(count),
  });

  return {
    randomCocktails: data ?? null,
    loading: isLoading,
    error: error ? (error as Error).message : null,
  };
}
