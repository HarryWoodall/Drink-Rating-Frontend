import { beforeEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { FavouritesPage } from "./FavouritesPage";
import { renderWithProviders, screen } from "@/test/utils";
import { fetchFavourites } from "@/services/api";
import type { DbDrinkDetails } from "@/types/cocktail";

vi.mock("@/services/api", () => ({
  fetchFavourites: vi.fn(),
  addFavourite: vi.fn(),
  removeFavourite: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  authClient: {
    useSession: () => ({
      data: { user: { id: "u1", name: "Harry", image: null } },
      isPending: false,
    }),
  },
}));

const mockFetchFavourites = vi.mocked(fetchFavourites);

function drink(id: string, name: string): DbDrinkDetails {
  return {
    idDrink: id,
    strDrink: name,
    strDrinkThumb: `https://example.test/${id}.jpg`,
    strCategory: "Cocktail",
    strAlcoholic: "Alcoholic",
    strInstructions: "Shake.",
    strIngredient1: "Gin",
    strIngredient2: null,
    strIngredient3: null,
    strIngredient4: null,
    strIngredient5: null,
  };
}

describe("FavouritesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders a card for each favourited drink", async () => {
    mockFetchFavourites.mockResolvedValue([
      drink("1", "Negroni"),
      drink("2", "Margarita"),
    ]);

    renderWithProviders(<FavouritesPage />, { route: "/favourites" });

    expect(await screen.findByText("Negroni")).toBeInTheDocument();
    expect(screen.getByText("Margarita")).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: "Remove from favourites" }),
    ).toHaveLength(2);
  });

  it("shows the empty state when nothing is favourited", async () => {
    mockFetchFavourites.mockResolvedValue([]);

    renderWithProviders(<FavouritesPage />, { route: "/favourites" });

    expect(await screen.findByText("Nothing saved yet")).toBeInTheDocument();
    expect(
      screen.queryByRole("textbox", { name: "Filter your favourites" }),
    ).not.toBeInTheDocument();
  });

  it("filters the grid as you type", async () => {
    mockFetchFavourites.mockResolvedValue([
      drink("1", "Negroni"),
      drink("2", "Margarita"),
    ]);

    renderWithProviders(<FavouritesPage />, { route: "/favourites" });
    await screen.findByText("Negroni");

    await userEvent.type(
      screen.getByRole("textbox", { name: "Filter your favourites" }),
      "marg",
    );

    expect(screen.getByText("Margarita")).toBeInTheDocument();
    expect(screen.queryByText("Negroni")).not.toBeInTheDocument();
  });

  it("shows a no-match state when the filter matches nothing", async () => {
    mockFetchFavourites.mockResolvedValue([drink("1", "Negroni")]);

    renderWithProviders(<FavouritesPage />, { route: "/favourites" });
    await screen.findByText("Negroni");

    await userEvent.type(
      screen.getByRole("textbox", { name: "Filter your favourites" }),
      "zzz",
    );

    expect(screen.getByText("Nothing on the shelf")).toBeInTheDocument();
    expect(screen.getByText(/No favourites match/)).toBeInTheDocument();
  });
});
