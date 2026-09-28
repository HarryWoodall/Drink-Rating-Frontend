import { waitFor } from "@testing-library/react";
import {
  useCocktailsFromIngredient,
  useTopIngredients,
} from "./ingredientShowcaseHooks";
import { getCocktailsForTopIngredients } from "../services/ingredientShowcaseService";
import { fetchTopIngredients } from "@/pages/homePage/services/homeService";
import { renderHookWithProviders } from "@/test/utils";
import { makeDrink } from "@/test/fixtures";

vi.mock("../services/ingredientShowcaseService", () => ({
  getCocktailsForTopIngredients: vi.fn(),
}));

vi.mock("@/pages/homePage/services/homeService", () => ({
  fetchTopIngredients: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useTopIngredients", () => {
  it("loads the ingredient list", async () => {
    const ingredients = [{ name: "Gin", alternatives: [] }];
    vi.mocked(fetchTopIngredients).mockResolvedValue(ingredients);

    const { result } = renderHookWithProviders(() => useTopIngredients());

    expect(result.current.ingredients).toEqual([]);
    await waitFor(() => expect(result.current.ingredients).toEqual(ingredients));
  });
});

describe("useCocktailsFromIngredient", () => {
  const gin = { name: "Gin", alternatives: ["Sloe gin"] };

  it("loads the top drinks for the ingredient", async () => {
    const drinks = [makeDrink()];
    vi.mocked(getCocktailsForTopIngredients).mockResolvedValue(drinks);

    const { result } = renderHookWithProviders(() =>
      useCocktailsFromIngredient(gin),
    );

    expect(result.current.drinks).toEqual([]);
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.drinks).toEqual(drinks));
    expect(getCocktailsForTopIngredients).toHaveBeenCalledWith(gin);
  });

  it("surfaces the error message", async () => {
    vi.mocked(getCocktailsForTopIngredients).mockRejectedValue(
      new Error("500"),
    );

    const { result } = renderHookWithProviders(() =>
      useCocktailsFromIngredient(gin),
    );

    await waitFor(() => expect(result.current.error).toBe("500"));
  });
});
