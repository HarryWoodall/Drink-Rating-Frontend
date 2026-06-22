import { useQuery } from "@tanstack/react-query";
import { fetchRandomCocktails } from "@/services/api";

export function useRandomCocktails(count = 6) {
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["randomCocktails", count],
    queryFn: () => fetchRandomCocktails(count),
    refetchOnWindowFocus: false,
  });

  return {
    randomCocktails: data ?? null,
    loading: isLoading,
    fetching: isFetching,
    error: error ? (error as Error).message : null,
    shuffle: refetch,
  };
}
