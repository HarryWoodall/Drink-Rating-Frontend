import { waitFor } from "@testing-library/react";
import { useCocktail } from "./useCocktail";
import { fetchCocktailById } from "../services/drinkService";
import { renderHookWithProviders } from "@/test/utils";
import { makeDrink } from "@/test/fixtures";

vi.mock("../services/drinkService", () => ({ fetchCocktailById: vi.fn() }));

describe("useCocktail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads the drink by id", async () => {
    const drink = makeDrink();
    vi.mocked(fetchCocktailById).mockResolvedValue(drink);

    const { result } = renderHookWithProviders(() => useCocktail("11007"));

    expect(result.current).toEqual({ cocktail: null, loading: true, error: null });
    await waitFor(() => expect(result.current.cocktail).toEqual(drink));
    expect(result.current.loading).toBe(false);
    expect(fetchCocktailById).toHaveBeenCalledWith("11007");
  });

  it("surfaces the error message", async () => {
    vi.mocked(fetchCocktailById).mockRejectedValue(new Error("404 Not Found"));

    const { result } = renderHookWithProviders(() => useCocktail("nope"));

    await waitFor(() => expect(result.current.error).toBe("404 Not Found"));
    expect(result.current.cocktail).toBeNull();
  });

  it("stays idle without an id", () => {
    const { result } = renderHookWithProviders(() => useCocktail(undefined));

    expect(fetchCocktailById).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
  });
});
