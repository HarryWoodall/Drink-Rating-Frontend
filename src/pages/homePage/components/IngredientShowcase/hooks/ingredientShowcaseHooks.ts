import { useQuery } from "@tanstack/react-query";
import { fetchTopIngredients } from "@/services/api";
import { TopIngredient } from "@/types/cocktail";
import { getCocktailsForTopIngredients } from "../services/ingredientShowcaseService";

export type SearchType = "name" | "ingredient";
export type AlcoholicFilter = "all" | "alcoholic" | "non-alcoholic";

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

export function useCocktailsFromIngredient(ingredient: TopIngredient) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["topIngredientCocktails" + ingredient.name],
    queryFn: () => getCocktailsForTopIngredients(ingredient),
  });

  return {
    drinks: data ?? [],
    loading: isLoading,
    error: error ? (error as Error).message : null,
  };
}
