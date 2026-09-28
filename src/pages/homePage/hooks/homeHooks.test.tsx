import { act, waitFor } from "@testing-library/react";
import { useRandomDrink } from "./useRandomDrink";
import { useTopRated } from "./useTopRated";
import { useTopIngredients } from "./useTopIngredients";
import { useRecentlyRated } from "./useRecentlyRated";
import { useIngredientShowcase } from "./useIngredientShowcase";
import {
  fetchIngredientShowcase,
  fetchRandomDrink,
  fetchTopIngredients,
  fetchTopRatedDrinks,
  fetchTrendingDrinks,
} from "../services/homeService";
import { renderHookWithProviders } from "@/test/utils";
import { makeDrink, makeTopRated } from "@/test/fixtures";

vi.mock("../services/homeService", () => ({
  fetchRandomDrink: vi.fn(),
  fetchTopRatedDrinks: vi.fn(),
  fetchTopIngredients: vi.fn(),
  fetchTrendingDrinks: vi.fn(),
  fetchIngredientShowcase: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useRandomDrink", () => {
  it("loads a random drink", async () => {
    const drink = makeDrink();
    vi.mocked(fetchRandomDrink).mockResolvedValue(drink);

    const { result } = renderHookWithProviders(() => useRandomDrink());

    expect(result.current.randomDrink).toBeNull();
    await waitFor(() => expect(result.current.randomDrink).toEqual(drink));
    expect(result.current.loading).toBe(false);
  });

  it("fetches a different drink on shuffle", async () => {
    const first = makeDrink({ id: "1", name: "Margarita" });
    const second = makeDrink({ id: "2", name: "Negroni" });
    vi.mocked(fetchRandomDrink)
      .mockResolvedValueOnce(first)
      .mockResolvedValueOnce(second);

    const { result } = renderHookWithProviders(() => useRandomDrink());
    await waitFor(() => expect(result.current.randomDrink).toEqual(first));

    await act(() => result.current.shuffle());

    await waitFor(() => expect(result.current.randomDrink).toEqual(second));
    expect(fetchRandomDrink).toHaveBeenCalledTimes(2);
  });

  it("surfaces the error message", async () => {
    vi.mocked(fetchRandomDrink).mockRejectedValue(new Error("503"));

    const { result } = renderHookWithProviders(() => useRandomDrink());

    await waitFor(() => expect(result.current.error).toBe("503"));
  });
});

describe("useTopRated", () => {
  it("returns the ranked list", async () => {
    const list = [makeTopRated(), makeTopRated({ id: "2" })];
    vi.mocked(fetchTopRatedDrinks).mockResolvedValue(list);

    const { result } = renderHookWithProviders(() => useTopRated());

    await waitFor(() => expect(result.current.topDrink).toEqual(list));
    expect(result.current.loading).toBe(false);
  });

  // TopRatedSection shows its empty state for `undefined`.
  it("treats an empty list as nothing rated", async () => {
    vi.mocked(fetchTopRatedDrinks).mockResolvedValue([]);

    const { result } = renderHookWithProviders(() => useTopRated());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.topDrink).toBeUndefined();
  });

  it("surfaces the error message", async () => {
    vi.mocked(fetchTopRatedDrinks).mockRejectedValue(new Error("500"));

    const { result } = renderHookWithProviders(() => useTopRated());

    await waitFor(() => expect(result.current.error).toBe("500"));
  });
});

describe("useTopIngredients", () => {
  it("defaults to an empty list, then loads the ingredients", async () => {
    const ingredients = [{ name: "Gin", alternatives: [] }];
    vi.mocked(fetchTopIngredients).mockResolvedValue(ingredients);

    const { result } = renderHookWithProviders(() => useTopIngredients());

    expect(result.current.ingredients).toEqual([]);
    await waitFor(() => expect(result.current.ingredients).toEqual(ingredients));
  });
});

describe("useRecentlyRated", () => {
  it("defaults to an empty list, then loads the trending drinks", async () => {
    const trending = [
      { drink: makeDrink(), avgRating: 4, numRatings: 2, numClients: 3 },
    ];
    vi.mocked(fetchTrendingDrinks).mockResolvedValue(trending);

    const { result } = renderHookWithProviders(() => useRecentlyRated());

    expect(result.current.recentCocktails).toEqual([]);
    await waitFor(() =>
      expect(result.current.recentCocktails).toEqual(trending),
    );
  });

  it("surfaces the error message", async () => {
    vi.mocked(fetchTrendingDrinks).mockRejectedValue(new Error("500"));

    const { result } = renderHookWithProviders(() => useRecentlyRated());

    await waitFor(() => expect(result.current.error).toBe("500"));
  });
});

describe("useIngredientShowcase", () => {
  const showcase = (ingredient: string) => ({
    ingredient,
    drinks: [],
    avgRating: 4,
    numRatings: 1,
  });

  it("stays idle until an ingredient is picked", () => {
    const { result } = renderHookWithProviders(() =>
      useIngredientShowcase(undefined),
    );

    expect(fetchIngredientShowcase).not.toHaveBeenCalled();
    expect(result.current.showcase).toBeUndefined();
  });

  it("keeps showing the previous ingredient while the next one loads", async () => {
    vi.mocked(fetchIngredientShowcase).mockImplementation(async (name) =>
      showcase(name),
    );

    const { result, rerender } = renderHookWithProviders(
      ({ name }: { name: string }) => useIngredientShowcase(name),
      { initialProps: { name: "Gin" } },
    );
    await waitFor(() =>
      expect(result.current.showcase?.ingredient).toBe("Gin"),
    );

    let resolveRum!: () => void;
    vi.mocked(fetchIngredientShowcase).mockImplementation(
      (name) =>
        new Promise((resolve) => {
          resolveRum = () => resolve(showcase(name));
        }),
    );
    rerender({ name: "Rum" });

    expect(result.current.showcase?.ingredient).toBe("Gin");

    await waitFor(() => expect(fetchIngredientShowcase).toHaveBeenCalledWith("Rum"));
    resolveRum();
    await waitFor(() =>
      expect(result.current.showcase?.ingredient).toBe("Rum"),
    );
  });
});
