import { get, post, put } from "@/services/apiService";
import { Drink, FeedbackResponse } from "@/types/cocktail";

export async function fetchCocktailById(id: string): Promise<Drink> {
  return get<Drink>(`/drinks/id/${encodeURIComponent(id)}`);
}

export async function postFeedback(
  drinkId: string,
  comment: string,
  rating: number,
): Promise<void> {
  return post<void>(`/drinks/${encodeURIComponent(drinkId)}/feedback`, {
    comment,
    rating,
  });
}

export async function putFeedback(
  drinkId: string,
  feedbackId: number,
  comment: string,
  rating: number,
): Promise<void> {
  return put<void>(
    `/drinks/${encodeURIComponent(drinkId)}/feedback/${feedbackId}`,
    {
      comment,
      rating,
    },
  );
}

export async function fetchFeedback(
  drinkId: string,
): Promise<FeedbackResponse> {
  return get<FeedbackResponse>(
    `/drinks/${encodeURIComponent(drinkId)}/feedback`,
  );
}
