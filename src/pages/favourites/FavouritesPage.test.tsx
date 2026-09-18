import { beforeEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { FavouritesPage } from "./FavouritesPage";
import { renderWithProviders, screen } from "@/test/utils";
import { fetchFavourites } from "@/services/favouritesService";
import type { Drink } from "@/types/cocktail";

vi.mock("@/services/favouritesService", () => ({
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

function drink(id: string, name: string): Drink {
  return {
    id,
    name,
    image: `https://example.test/${id}.jpg`,
    category: "Cocktail",
    alcoholic: true,
    glass: "Coupe",
    instructions: "Shake.",
    tags: null,
    ingredients: [{ id: 1, name: "Gin", measure: "50ml" }],
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
