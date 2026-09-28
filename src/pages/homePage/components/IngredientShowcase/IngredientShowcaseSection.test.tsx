import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { IngredientShowcaseSection } from "./IngredientShowcaseSection";
import { getCocktailsForTopIngredients } from "./services/ingredientShowcaseService";
import { fetchTopIngredients } from "@/pages/homePage/services/homeService";
import { authClient } from "@/lib/auth";
import { renderWithProviders } from "@/test/utils";
import { makeDrink, sessionState } from "@/test/fixtures";

vi.mock("./services/ingredientShowcaseService", () => ({
  getCocktailsForTopIngredients: vi.fn(),
}));

vi.mock("@/pages/homePage/services/homeService", () => ({
  fetchTopIngredients: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({ authClient: { useSession: vi.fn() } }));

const gin = { name: "Gin", alternatives: [] };
const rum = { name: "Rum", alternatives: ["Dark rum"], count: 42 };

/** The drinks the showcase is currently listing, by name. */
function showcasedNames() {
  return screen
    .getAllByTestId("drink-showcase-card-name")
    .map((name) => name.textContent);
}

describe("IngredientShowcaseSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authClient.useSession).mockReturnValue(sessionState(null));
    vi.mocked(fetchTopIngredients).mockResolvedValue([gin, rum]);
    vi.mocked(getCocktailsForTopIngredients).mockImplementation(
      async (ingredient) =>
        ingredient.name === "Gin"
          ? [makeDrink({ id: "g1", name: "Gimlet" })]
          : [
              makeDrink({ id: "r1", name: "Daiquiri" }),
              makeDrink({ id: "r2", name: "Mai Tai" }),
            ],
    );
  });

  it("shows only the heading until the ingredients load", () => {
    vi.mocked(fetchTopIngredients).mockReturnValue(new Promise(() => {}));

    renderWithProviders(<IngredientShowcaseSection />);

    expect(screen.getByTestId("section-heading-title")).toHaveTextContent(
      "Top Drink by Ingredient",
    );
    expect(screen.queryByTestId("ingredient-tabs")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("ingredient-drink-list"),
    ).not.toBeInTheDocument();
  });

  it("renders a tab per ingredient, with counts where known", async () => {
    renderWithProviders(<IngredientShowcaseSection />);

    const tabs = await screen.findAllByTestId("ingredient-tab");
    expect(tabs.map((t) => t.firstChild?.textContent)).toEqual(["Gin", "Rum"]);
    expect(screen.getByTestId("ingredient-tab-count")).toHaveTextContent("42");
  });

  it("selects the first ingredient and shows its top drinks", async () => {
    renderWithProviders(<IngredientShowcaseSection />);

    const [first, second] = await screen.findAllByTestId("ingredient-tab");
    expect(first).toHaveAttribute("aria-selected", "true");
    expect(second).toHaveAttribute("aria-selected", "false");

    await screen.findByTestId("drink-showcase-card");
    expect(showcasedNames()).toEqual(["Gimlet"]);
    expect(getCocktailsForTopIngredients).toHaveBeenCalledWith(gin);
  });

  it("switches drinks when another ingredient is picked", async () => {
    renderWithProviders(<IngredientShowcaseSection />);
    await screen.findByTestId("drink-showcase-card");

    await userEvent.click(screen.getAllByTestId("ingredient-tab")[1]);

    await waitFor(() => expect(showcasedNames()).toEqual(["Daiquiri", "Mai Tai"]));
    expect(screen.getAllByTestId("ingredient-tab")[1]).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(getCocktailsForTopIngredients).toHaveBeenCalledWith(rum);
  });

  it("links each showcased drink to its page", async () => {
    renderWithProviders(<IngredientShowcaseSection />);

    expect(
      await screen.findByTestId("ingredient-drink-list-link"),
    ).toHaveAttribute("href", "/cocktail/g1");
  });

  it("says when no one has rated a drink with the ingredient", async () => {
    vi.mocked(getCocktailsForTopIngredients).mockResolvedValue([]);

    renderWithProviders(<IngredientShowcaseSection />);

    expect(
      await screen.findByTestId("ingredient-drink-list-empty"),
    ).toHaveTextContent("No one has rated a gin drink yet.");
  });

  it("shows skeletons while the drinks load", async () => {
    vi.mocked(getCocktailsForTopIngredients).mockReturnValue(
      new Promise(() => {}),
    );

    renderWithProviders(<IngredientShowcaseSection />);

    expect(
      await screen.findByTestId("ingredient-drink-list-loading"),
    ).toBeInTheDocument();
  });

  it("shows the error when the drinks fail to load", async () => {
    vi.mocked(getCocktailsForTopIngredients).mockRejectedValue(
      new Error("500"),
    );

    renderWithProviders(<IngredientShowcaseSection />);

    expect(
      await screen.findByTestId("ingredient-drink-list-error"),
    ).toHaveTextContent("Failed to load the top drinks by ingredient.");
  });
});
