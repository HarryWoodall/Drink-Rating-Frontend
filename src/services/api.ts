import type {
  CocktailDbDrink,
  CocktailDetail,
  Comment,
  DbCocktail,
  Feedback,
  TopRatedResponse,
  TrendingResponse,
} from "@/types/cocktail";
import type { AuthResponse } from "@/types/auth";

const BASE_URL = "http://localhost:3000/api";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
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
    throw new Error(
      (data as { message?: string })?.message ??
        `${res.status} ${res.statusText}`,
    );
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

export async function fetchFeedback(drinkId: string): Promise<Feedback[]> {
  return get<Feedback[]>(`/drinks/${encodeURIComponent(drinkId)}/feedback`);
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
