import {
  browseDrinks,
  searchCocktailsByIngredient,
  searchCocktailsByName,
} from "./searchService";
import { get } from "@/services/apiService";

vi.mock("@/services/apiService", () => ({ get: vi.fn() }));

const emptyResponse = { pagination: { totalResults: 0, pages: 0 }, drinks: [] };

/** The path the single `get` call was made with. */
function requestedPath() {
  expect(get).toHaveBeenCalledOnce();
  return vi.mocked(get).mock.calls[0][0];
}

describe("searchService", () => {
  beforeEach(() => {
    vi.mocked(get).mockReset().mockResolvedValue(emptyResponse);
    // searchCocktailsByIngredient logs its arguments.
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  describe("browseDrinks", () => {
    it("hits /drinks with no query string when nothing is filtered", async () => {
      await expect(browseDrinks()).resolves.toBe(emptyResponse);

      expect(requestedPath()).toBe("/drinks");
    });

    it("adds alcoholic, category and page as query params", async () => {
      await browseDrinks(false, "Cocktail", 3);

      expect(requestedPath()).toBe(
        "/drinks?alcoholic=false&category=Cocktail&page=3",
      );
    });

    it("sends the page size as `limit`", async () => {
      await browseDrinks(undefined, undefined, 2, 24);

      expect(requestedPath()).toBe("/drinks?page=2&limit=24");
    });
  });

  describe("searchCocktailsByName", () => {
    it("encodes the name into the path", async () => {
      await searchCocktailsByName("Old Fashioned");

      expect(requestedPath()).toBe("/drinks/name/Old%20Fashioned");
    });

    it("appends the filters", async () => {
      await searchCocktailsByName("gin", true, "Shot", 2);

      expect(requestedPath()).toBe(
        "/drinks/name/gin?alcoholic=true&category=Shot&page=2",
      );
    });
  });

  describe("searchCocktailsByIngredient", () => {
    it("encodes the ingredient into the path", async () => {
      await searchCocktailsByIngredient("Dark rum");

      expect(requestedPath()).toBe("/drinks/ingredient/Dark%20rum");
    });

    it("appends the filters", async () => {
      await searchCocktailsByIngredient("Vodka", false, undefined, 4);

      expect(requestedPath()).toBe(
        "/drinks/ingredient/Vodka?alcoholic=false&page=4",
      );
    });
  });
});
