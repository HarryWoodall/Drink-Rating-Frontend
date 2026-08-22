import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchIngredientShowcase } from "@/services/api";

export function useIngredientShowcase(ingredient: string | undefined) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["ingredientShowcase", ingredient],
    queryFn: () => fetchIngredientShowcase(ingredient!),
    enabled: !!ingredient,
    // Keep the previous ingredient's drinks on screen while the next set loads,
    // so switching tabs doesn't collapse the grid back to skeletons every time.
    placeholderData: keepPreviousData,
  });

  return {
    showcase: data,
    loading: isLoading,
    error: error ? (error as Error).message : null,
  };
}
