import { useQuery } from "@tanstack/react-query";
import { fetchTopIngredients } from "@/services/api";

export function useTopIngredients() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["topIngredients"],
    queryFn: fetchTopIngredients,
  });

  return {
    ingredients: data ?? [],
    loading: isLoading,
    error: error ? (error as Error).message : null,
  };
}
