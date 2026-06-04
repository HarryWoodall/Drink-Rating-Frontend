import type {
  CocktailDbDrink,
  CocktailDetail,
  DbCocktail,
} from "@/types/cocktail";

const BASE_URL = "http://localhost:3000/api";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

export async function fetchDbCocktails(): Promise<DbCocktail[]> {
  return get<DbCocktail[]>("/cocktails");
}

export async function getRandomCocktail(): Promise<CocktailDbDrink> {
  const res = await get<CocktailDbDrink>("/cocktails/random");
  return res;
}

/** Full drink lookup by CocktailDB id. */
export async function fetchCocktailById(id: string): Promise<CocktailDetail> {
  return get<CocktailDetail>(`/cocktails/id/${encodeURIComponent(id)}`);
}

/**
 * Full drink lookup by name — backs the individual cocktail page. The server's
 * by-name endpoint returns the rich CocktailDB drink list; we take the first.
 */
export async function fetchCocktailByName(
  name: string,
): Promise<CocktailDetail | null> {
  const drinks = await get<CocktailDetail[] | null>(
    `/cocktails/name/${encodeURIComponent(name)}`,
  );
  return drinks?.[0] ?? null;
}

export async function searchCocktailByName(
  name: string,
): Promise<CocktailDbDrink | null> {
  const drinks = await get<CocktailDbDrink[] | null>(
    `/cocktails/name/${encodeURIComponent(name)}`,
  );
  return drinks?.[0] ?? null;
}

export async function fetchRandomCocktails(
  _count: number,
): Promise<CocktailDbDrink> {
  return await getRandomCocktail();
}
