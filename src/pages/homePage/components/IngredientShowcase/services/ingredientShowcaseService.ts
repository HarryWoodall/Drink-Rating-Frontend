import { get } from "@/services/apiService";
import { Drink, TopIngredient } from "@/types/cocktail";

export async function getCocktailsForTopIngredients(
  ingredient: TopIngredient,
): Promise<Drink[]> {
  const drinks = await get<Drink[] | null>(
    `/drinks/top-from-ingredient/${encodeURIComponent(ingredient.name)}${buildAlternativeQuery(ingredient)}`,
  );
  return drinks ?? [];
}

function buildAlternativeQuery(ingredient: TopIngredient): string {
  if (!ingredient.alternatives || ingredient.alternatives.length === 0) {
    return "";
  }

  return (
    "?" + ingredient.alternatives.map((x) => `alternatives=${x}`).join("&")
  );
}
