import { useQuery } from "@tanstack/react-query";
import { fetchDbCocktails } from "@/services/api";

export function useRecentlyRated(limit = 5) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["cocktails"],
    queryFn: fetchDbCocktails,
  });

  const recentCocktails = data
    ? [...data]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit)
    : [];

  return {
    recentCocktails,
    loading: isLoading,
    error: error ? (error as Error).message : null,
  };
}
