import { useQuery } from "@tanstack/react-query";
import { fetchTrendingDrinks } from "../services/homeService";

export function useRecentlyRated() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["trendingCocktails"],
    queryFn: fetchTrendingDrinks,
  });

  const recentCocktails = data ? data : [];

  return {
    recentCocktails,
    loading: isLoading,
    error: error ? (error as Error).message : null,
  };
}
