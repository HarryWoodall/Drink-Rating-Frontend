import { get } from "@/services/apiService";
import {
  Drink,
  IngredientShowcaseResponse,
  TopIngredient,
  TopRatedResponse,
  TrendingResponse,
} from "@/types/cocktail";

export async function fetchRandomDrink(): Promise<Drink> {
  return await get<Drink>("/drinks/random");
}

export async function fetchTopRatedDrinks(): Promise<TopRatedResponse[]> {
  return get<TopRatedResponse[]>("/drinks/top-rated");
}

export async function fetchTopIngredients(): Promise<TopIngredient[]> {
  return get<TopIngredient[]>("/drinks/top-ingredient-list");
}

export async function fetchTrendingDrinks(): Promise<TrendingResponse[]> {
  return get<TrendingResponse[]>("/drinks/trending");
}

export async function fetchIngredientShowcase(
  ingredient: string,
): Promise<IngredientShowcaseResponse> {
  return get<IngredientShowcaseResponse>(
    `/drinks/ingredient/${encodeURIComponent(ingredient)}/showcase`,
  );
}
