/** Route to an individual cocktail page, keyed by drink name. */
export function cocktailPath(name: string): string {
  return `/cocktail/${encodeURIComponent(name)}`;
}

export function loginPath(): string {
  return "/login";
}

export function registerPath(): string {
  return "/register";
}
