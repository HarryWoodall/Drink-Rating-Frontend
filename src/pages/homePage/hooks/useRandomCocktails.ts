import { useQuery } from "@tanstack/react-query";
import { fetchRandomDrink } from "@/services/api";

export function useRandomDrink() {
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["randomCocktails"],
    queryFn: () => fetchRandomDrink(),
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
