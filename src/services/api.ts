import type {
  CocktailDbDrink,
  CocktailDetail,
  Comment,
  DbCocktail,
  FeedbackResponse,
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

async function post<T>(path: string, body: unknown): Promise<T> {
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

  return res.json() as Promise<T>;
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

export async function fetchDbCocktails(): Promise<DbCocktail[]> {
  return get<DbCocktail[]>("/drinks");
}

export async function fetchTopRatedDrinks(): Promise<TopRatedResponse[]> {
  return get<TopRatedResponse[]>("/drinks/top-rated");
}

export async function fetchTrendingDrinks(): Promise<TrendingResponse[]> {
  return get<TrendingResponse[]>("/drinks/trending");
}

export async function getRandomCocktail(): Promise<CocktailDetail> {
  return get<CocktailDetail>("/drinks/random");
}

/** Full drink lookup by CocktailDB id. */
export async function fetchCocktailById(id: string): Promise<CocktailDetail> {
  return get<CocktailDetail>(`/drinks/id/${encodeURIComponent(id)}`);
}

/**
 * Full drink lookup by name — backs the individual cocktail page. The server's
 * by-name endpoint returns the rich CocktailDB drink list; we take the first.
 */
export async function fetchCocktailByName(
  name: string,
): Promise<CocktailDetail | null> {
  const drinks = await get<CocktailDetail[] | null>(
    `/drinks/name/${encodeURIComponent(name)}`,
  );
  return drinks?.[0] ?? null;
}

export async function searchCocktailByName(
  name: string,
): Promise<CocktailDbDrink | null> {
  console.log("searching cocktail by name");
  const drinks = await get<CocktailDbDrink[] | null>(
    `/drinks/name/${encodeURIComponent(name)}`,
  );
  return drinks?.[0] ?? null;
}

export async function searchCocktailsByName(
  name: string,
): Promise<CocktailDetail[]> {
  const drinks = await get<CocktailDetail[] | null>(
    `/drinks/name/${encodeURIComponent(name)}`,
  );
  return drinks ?? [];
}

export async function searchCocktailsByIngredient(
  ingredient: string,
): Promise<CocktailDetail[]> {
  const drinks = await get<CocktailDetail[] | null>(
    `/drinks/ingredient/${encodeURIComponent(ingredient)}`,
  );
  return drinks ?? [];
}

export async function fetchRandomCocktails(
  _count: number,
): Promise<CocktailDetail> {
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
