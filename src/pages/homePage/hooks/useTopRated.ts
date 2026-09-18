import { useQuery } from "@tanstack/react-query";
import { fetchTopRatedDrinks } from "../services/homeService";

export function useTopRated() {
  const {
    data: drinks,
    isLoading: loadingCocktails,
    error: cocktailsError,
  } = useQuery({
    queryKey: ["cocktails"],
    queryFn: fetchTopRatedDrinks,
  });

  const TopDrink = drinks?.length ? drinks : undefined;
  const error = cocktailsError;

  return {
    topDrink: TopDrink,
    loading: loadingCocktails || loadingCocktails,
    error: error ? (error as Error).message : null,
  };
}
