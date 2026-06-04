/** Route to an individual cocktail page, keyed by drink name. */
export function cocktailPath(name: string): string {
  return `/cocktail/${encodeURIComponent(name)}`;
}
