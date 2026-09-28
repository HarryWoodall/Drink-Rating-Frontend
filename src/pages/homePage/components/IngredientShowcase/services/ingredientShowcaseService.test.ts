import { getCocktailsForTopIngredients } from "./ingredientShowcaseService";
import { get } from "@/services/apiService";
import { makeDrink } from "@/test/fixtures";

vi.mock("@/services/apiService", () => ({ get: vi.fn() }));

describe("getCocktailsForTopIngredients", () => {
  beforeEach(() => {
    vi.mocked(get).mockReset().mockResolvedValue([]);
  });

  it("requests the ingredient's top drinks without a query when it has no alternatives", async () => {
    await getCocktailsForTopIngredients({ name: "Dark rum", alternatives: [] });

    expect(get).toHaveBeenCalledWith("/drinks/top-from-ingredient/Dark%20rum");
  });

  it("passes each alternative as a repeated query param", async () => {
    await getCocktailsForTopIngredients({
      name: "Rum",
      alternatives: ["Light rum", "Spiced rum"],
    });

    expect(get).toHaveBeenCalledWith(
      "/drinks/top-from-ingredient/Rum?alternatives=Light rum&alternatives=Spiced rum",
    );
  });

  it("returns the drinks", async () => {
    const drinks = [makeDrink()];
    vi.mocked(get).mockResolvedValue(drinks);

    await expect(
      getCocktailsForTopIngredients({ name: "Gin", alternatives: [] }),
    ).resolves.toBe(drinks);
  });

  it("treats a null response as no drinks", async () => {
    vi.mocked(get).mockResolvedValue(null);

    await expect(
      getCocktailsForTopIngredients({ name: "Gin", alternatives: [] }),
    ).resolves.toEqual([]);
  });
});
