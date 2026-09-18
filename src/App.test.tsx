import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { renderWithProviders, screen } from "./test/utils";
import {
  fetchRandomDrink,
  fetchTopIngredients,
  fetchTopRatedDrinks,
} from "@/pages/homePage/services/homeService";
import {
  fetchCocktailById,
  fetchFeedback,
} from "@/pages/drink/services/drinkService";
import type { Drink } from "@/types/cocktail";

// Keep the real modules (App pulls in every page, so every export must exist)
// and stub only the fetches the routes under test actually make.
vi.mock("@/pages/homePage/services/homeService", async (importOriginal) => ({
  ...(await importOriginal<
    typeof import("@/pages/homePage/services/homeService")
  >()),
  fetchRandomDrink: vi.fn(),
  fetchTopIngredients: vi.fn(),
  fetchTopRatedDrinks: vi.fn(),
}));

vi.mock("@/pages/drink/services/drinkService", async (importOriginal) => ({
  ...(await importOriginal<
    typeof import("@/pages/drink/services/drinkService")
  >()),
  fetchCocktailById: vi.fn(),
  fetchFeedback: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  authClient: {
    useSession: () => ({ data: null, isPending: false }),
    signOut: vi.fn(),
  },
}));

const margarita: Drink = {
  id: "11007",
  name: "Margarita",
  image: "https://example.test/margarita.jpg",
  category: "Ordinary Drink",
  alcoholic: true,
  glass: "Cocktail glass",
  instructions: "Rub the rim with lime, shake, and strain.",
  tags: null,
  ingredients: [{ id: 1, name: "Tequila", measure: "50ml" }],
};

describe("App routing", () => {
  beforeEach(() => {
    vi.mocked(fetchCocktailById).mockResolvedValue(margarita);
    vi.mocked(fetchFeedback).mockResolvedValue({
      userHasCommented: false,
      feedback: [],
    });
    vi.mocked(fetchRandomDrink).mockResolvedValue(margarita);
    vi.mocked(fetchTopIngredients).mockResolvedValue([]);
    vi.mocked(fetchTopRatedDrinks).mockResolvedValue([]);
  });

  it("renders the home page at /", () => {
    renderWithProviders(<App />, { route: "/" });
    expect(
      screen.getByRole("heading", { name: /Every great night starts with/i }),
    ).toBeInTheDocument();
  });

  it("renders an individual cocktail page (not a modal)", async () => {
    renderWithProviders(<App />, { route: "/cocktail/Margarita" });
    expect(
      await screen.findByRole("heading", { name: "Margarita", level: 1 }),
    ).toBeInTheDocument();
  });

  it("renders the about page at /about", () => {
    renderWithProviders(<App />, { route: "/about" });
    expect(screen.getByRole("heading", { name: "About" })).toBeInTheDocument();
  });

  it("renders the 404 page for unknown routes", () => {
    renderWithProviders(<App />, { route: "/does-not-exist" });
    expect(screen.getByRole("heading", { name: "404" })).toBeInTheDocument();
  });
});
