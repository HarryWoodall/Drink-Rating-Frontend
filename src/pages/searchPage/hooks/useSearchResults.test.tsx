import { waitFor } from "@testing-library/react";
import { useSearchResults } from "./useSearchResults";
import {
  browseDrinks,
  searchCocktailsByIngredient,
  searchCocktailsByName,
} from "../services/searchService";
import { renderHookWithProviders } from "@/test/utils";
import { makeDrink } from "@/test/fixtures";
import type { DrinkSearchResponse } from "@/types/cocktail";

vi.mock("../services/searchService", () => ({
  browseDrinks: vi.fn(),
  searchCocktailsByName: vi.fn(),
  searchCocktailsByIngredient: vi.fn(),
}));

function response(...names: string[]): DrinkSearchResponse {
  return {
    pagination: { totalResults: names.length, pages: 1 },
    drinks: names.map((name, i) => makeDrink({ id: String(i), name })),
  };
}

describe("useSearchResults", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(browseDrinks).mockResolvedValue(response("Browse"));
    vi.mocked(searchCocktailsByName).mockResolvedValue(response("ByName"));
    vi.mocked(searchCocktailsByIngredient).mockResolvedValue(
      response("ByIngredient"),
    );
  });

  it("browses the catalogue when there's no query", async () => {
    const { result } = renderHookWithProviders(() =>
      useSearchResults("name", "all", "All", 1),
    );

    await waitFor(() =>
      expect(result.current.results?.drinks[0].name).toBe("Browse"),
    );
    expect(browseDrinks).toHaveBeenCalledWith(undefined, "All", 1, undefined);
  });

  it("searches by name", async () => {
    const { result } = renderHookWithProviders(() =>
      useSearchResults("name", "all", "All", 1, "marg"),
    );

    await waitFor(() =>
      expect(result.current.results?.drinks[0].name).toBe("ByName"),
    );
    expect(searchCocktailsByName).toHaveBeenCalledWith(
      "marg",
      undefined,
      "All",
      1,
      undefined,
    );
  });

  it("searches by ingredient", async () => {
    const { result } = renderHookWithProviders(() =>
      useSearchResults("ingredient", "all", "Cocktail", 2, "gin", 12),
    );

    await waitFor(() =>
      expect(result.current.results?.drinks[0].name).toBe("ByIngredient"),
    );
    expect(searchCocktailsByIngredient).toHaveBeenCalledWith(
      "gin",
      undefined,
      "Cocktail",
      2,
      12,
    );
  });

  it.each([
    ["alcoholic", true],
    ["non-alcoholic", false],
    ["all", undefined],
  ] as const)("maps the %s filter to alcoholic=%s", async (filter, expected) => {
    renderHookWithProviders(() => useSearchResults("name", filter, "All", 1));

    await waitFor(() =>
      expect(browseDrinks).toHaveBeenCalledWith(expected, "All", 1, undefined),
    );
  });

  it("surfaces the error message", async () => {
    vi.mocked(browseDrinks).mockRejectedValue(new Error("500 Server Error"));

    const { result } = renderHookWithProviders(() =>
      useSearchResults("name", "all", "All", 1),
    );

    await waitFor(() => expect(result.current.error).toBe("500 Server Error"));
  });
});
