/** Route to an individual cocktail page, keyed by drink name. */
export function cocktailPath(name: string): string {
  return `/cocktail/${encodeURIComponent(name)}`;
}

export function searchPath(
  q: string,
  type: "name" | "ingredient" = "name",
  filter: "all" | "alcoholic" | "non-alcoholic" = "all",
): string {
  const params = new URLSearchParams({ q, type, filter });
  return `/search?${params.toString()}`;
}

export function loginPath(): string {
  return "/login";
}

export function registerPath(): string {
  return "/register";
}
