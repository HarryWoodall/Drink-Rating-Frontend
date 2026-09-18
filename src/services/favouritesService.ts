import { Drink } from "@/types/cocktail";
import { del, get, post } from "./apiService";

export async function addFavourite(drinkId: string): Promise<void> {
  return post<void>(`/drinks/${encodeURIComponent(drinkId)}/favourite`, {});
}

export async function removeFavourite(drinkId: string): Promise<void> {
  return del<void>(`/drinks/${encodeURIComponent(drinkId)}/favourite`);
}

/** Every drink the signed-in user has favourited. */
export async function fetchFavourites(): Promise<Drink[]> {
  return get<Drink[]>("/drinks/favourites");
}
