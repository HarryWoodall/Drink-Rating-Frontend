import {
  fetchIngredientShowcase,
  fetchRandomDrink,
  fetchTopIngredients,
  fetchTopRatedDrinks,
  fetchTrendingDrinks,
} from "./homeService";
import { get } from "@/services/apiService";

vi.mock("@/services/apiService", () => ({ get: vi.fn() }));

describe("homeService", () => {
  beforeEach(() => {
    vi.mocked(get).mockReset().mockResolvedValue("response");
  });

  it.each([
    ["fetchRandomDrink", fetchRandomDrink, "/drinks/random"],
    ["fetchTopRatedDrinks", fetchTopRatedDrinks, "/drinks/top-rated"],
    ["fetchTopIngredients", fetchTopIngredients, "/drinks/top-ingredient-list"],
    ["fetchTrendingDrinks", fetchTrendingDrinks, "/drinks/trending"],
  ])("%s gets %s", async (_name, fetcher, path) => {
    await expect(fetcher()).resolves.toBe("response");
    expect(get).toHaveBeenCalledWith(path);
  });

  it("fetchIngredientShowcase encodes the ingredient into the path", async () => {
    await fetchIngredientShowcase("Dark rum");

    expect(get).toHaveBeenCalledWith("/drinks/ingredient/Dark%20rum/showcase");
  });
});
