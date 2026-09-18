import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchIngredientShowcase } from "../services/homeService";

export function useIngredientShowcase(ingredient: string | undefined) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["ingredientShowcase", ingredient],
    queryFn: () => fetchIngredientShowcase(ingredient!),
    enabled: !!ingredient,
    placeholderData: keepPreviousData,
  });

  return {
    showcase: data,
    loading: isLoading,
    error: error ? (error as Error).message : null,
  };
}
