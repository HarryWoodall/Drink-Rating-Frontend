import { useQuery } from "@tanstack/react-query";
import { fetchDbCocktails, searchCocktailByName } from "@/services/api";
import type { EnrichedCocktail } from "@/types/cocktail";

export function useTopRated() {
  const { data: cocktails, isLoading: loadingCocktails, error: cocktailsError } = useQuery({
    queryKey: ["cocktails"],
    queryFn: fetchDbCocktails,
  });

  const topCocktail = cocktails?.length
    ? [...cocktails].sort((a, b) => b.rating - a.rating)[0]
    : undefined;

  const { data: drink, isLoading: loadingDrink, error: drinkError } = useQuery({
    queryKey: ["cocktailSearch", topCocktail?.name],
    queryFn: () => searchCocktailByName(topCocktail!.name),
    enabled: !!topCocktail,
  });

  const topRated: EnrichedCocktail | null = topCocktail
    ? { ...topCocktail, thumbUrl: drink?.strDrinkThumb }
    : null;

  const error = cocktailsError ?? drinkError;

  return {
    topRated,
    loading: loadingCocktails || loadingDrink,
    error: error ? (error as Error).message : null,
  };
}
