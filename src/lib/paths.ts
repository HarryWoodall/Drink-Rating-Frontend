import type { AlcoholicFilter, SearchType } from "@/types/search";

/** Route to an individual cocktail page, keyed by drink name. */
export function cocktailPath(name: string): string {
  return `/cocktail/${encodeURIComponent(name)}`;
}

export function searchPath(
  q: string,
  type: SearchType = "name",
  filter: AlcoholicFilter = "all",
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

export function profilePath(): string {
  return "/profile";
}

export function favouritesPath(): string {
  return "/favourites";
}

export function resetPasswordRequest(): string {
  return "/reset-password-request";
}

export function cocktailPageEvents(id: string | undefined): string | undefined {
  if (!id) return;

  return `/api/events/cocktail/${id}`;
}

export function baseImageStore(): string {
  return "https://blobs.harry-woodall-development.uk/public/image";
}
