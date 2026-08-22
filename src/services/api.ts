import type {
  Comment,
  DbDrink,
  Drink,
  FeedbackResponse,
  IngredientShowcaseResponse,
  TopIngredient,
  TopRatedResponse,
  TrendingResponse,
} from "@/types/cocktail";
import type { AuthResponse, UserFeedbackItem } from "@/types/auth";
import { HttpError } from "@/lib/errors";

const BASE_URL = "http://localhost:3000/api";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

export async function postWithFormData<T>(
  path: string,
  formData: FormData,
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new HttpError(res.status, res.statusText, data, res);
  }

  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new HttpError(res.status, res.statusText, data, res);
  }

  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

async function del<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new HttpError(res.status, res.statusText, data, res);
  }

  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

// TODO - move common logic with POST into single method
async function put<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new HttpError(res.status, res.statusText, data, res);
  }

  return res.json() as Promise<T>;
}

// TODO - move these into their own services

export async function fetchDbCocktails(): Promise<DbDrink[]> {
  return get<DbDrink[]>("/drinks");
}

export async function fetchTopRatedDrinks(): Promise<TopRatedResponse[]> {
  return get<TopRatedResponse[]>("/drinks/top-rated");
}

export async function fetchTrendingDrinks(): Promise<TrendingResponse[]> {
  return get<TrendingResponse[]>("/drinks/trending");
}

export async function fetchTopIngredients(): Promise<TopIngredient[]> {
  return get<TopIngredient[]>("/drinks/top-ingredient-list");
}

/**
 * The highest-rated drinks made with a given ingredient.
 * NOTE: this endpoint is not implemented on the server yet.
 */
export async function fetchIngredientShowcase(
  ingredient: string,
): Promise<IngredientShowcaseResponse> {
  return get<IngredientShowcaseResponse>(
    `/drinks/ingredient/${encodeURIComponent(ingredient)}/showcase`,
  );
}

export async function getRandomCocktail(): Promise<Drink> {
  return get<Drink>("/drinks/random");
}

/** Full drink lookup by CocktailDB id. */
export async function fetchCocktailById(id: string): Promise<Drink> {
  return get<Drink>(`/drinks/id/${encodeURIComponent(id)}`);
}

/**
 * Full drink lookup by name — backs the individual cocktail page. The server's
 * by-name endpoint returns the rich CocktailDB drink list; we take the first.
 */
export async function fetchCocktailByName(
  name: string,
): Promise<Drink | null> {
  const drinks = await get<Drink[] | null>(
    `/drinks/name/${encodeURIComponent(name)}`,
  );
  return drinks?.[0] ?? null;
}

export async function searchCocktailByName(
  name: string,
): Promise<Drink | null> {
  const drinks = await get<Drink[] | null>(
    `/drinks/name/${encodeURIComponent(name)}`,
  );
  return drinks?.[0] ?? null;
}

export async function searchCocktailsByName(
  name: string,
): Promise<Drink[]> {
  const drinks = await get<Drink[] | null>(
    `/drinks/name/${encodeURIComponent(name)}`,
  );
  return drinks ?? [];
}

export async function searchCocktailsByIngredient(
  ingredient: string,
): Promise<Drink[]> {
  const drinks = await get<Drink[] | null>(
    `/drinks/ingredient/${encodeURIComponent(ingredient)}`,
  );
  return drinks ?? [];
}

export async function fetchRandomDrink(): Promise<Drink> {
  return await getRandomCocktail();
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

export async function fetchFeedback(
  drinkId: string,
): Promise<FeedbackResponse> {
  return get<FeedbackResponse>(
    `/drinks/${encodeURIComponent(drinkId)}/feedback`,
  );
}

export async function fetchComments(drinkId: string): Promise<Comment[]> {
  return get<Comment[]>(`/drinks/${encodeURIComponent(drinkId)}/comments`);
}

// TODO - move to service
export async function postComment(
  drinkId: string,
  comment: string,
): Promise<Comment> {
  return post<Comment>(`/drinks/${encodeURIComponent(drinkId)}/comments`, {
    comment,
  });
}

export async function loginUser(
  email: string,
  password: string,
): Promise<AuthResponse> {
  return post<AuthResponse>("/auth/login", { email, password });
}

export async function registerUser(
  email: string,
  password: string,
): Promise<AuthResponse> {
  return post<AuthResponse>("/auth/register", { email, password });
}

export async function fetchUserFeedback(): Promise<UserFeedbackItem[]> {
  return get<UserFeedbackItem[]>("/users/me/feedback");
}

export async function uploadProfileImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  console.log(formData);

  const data = await postWithFormData<{ imageUrl: string }>(
    "/users/me/profile/image",
    formData,
  );

  return data.imageUrl;
}
