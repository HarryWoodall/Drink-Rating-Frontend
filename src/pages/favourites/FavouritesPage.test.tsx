import { beforeEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import { FavouritesPage } from "./FavouritesPage";
import { renderWithProviders, screen } from "@/test/utils";
import { fetchFavourites } from "@/services/favouritesService";
import { authClient } from "@/lib/auth";
import { sessionState } from "@/test/fixtures";
import type { Drink } from "@/types/cocktail";

vi.mock("@/services/favouritesService", () => ({
  fetchFavourites: vi.fn(),
  addFavourite: vi.fn(),
  removeFavourite: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({ authClient: { useSession: vi.fn() } }));

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

function renderFavouritesPage() {
  return renderWithProviders(
    <Routes>
      <Route path="/favourites" element={<FavouritesPage />} />
      <Route path="/login" element={<p data-testid="login-page" />} />
    </Routes>,
    { route: "/favourites" },
  );
}

/** Names of the drinks currently shown in the grid. */
function cardNames() {
  return screen
    .getAllByTestId("cocktail-card-name")
    .map((name) => name.textContent);
}

describe("FavouritesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authClient.useSession).mockReturnValue(sessionState());
  });

  it("renders a card for each favourited drink", async () => {
    mockFetchFavourites.mockResolvedValue([
      drink("1", "Negroni"),
      drink("2", "Margarita"),
    ]);

    renderFavouritesPage();

    await screen.findByTestId("favourites-grid");
    expect(cardNames()).toEqual(["Negroni", "Margarita"]);

    const buttons = screen.getAllByTestId("favourite-button");
    expect(buttons).toHaveLength(2);
    buttons.forEach((button) =>
      expect(button).toHaveAccessibleName("Remove from favourites"),
    );
  });

  it("shows the empty state when nothing is favourited", async () => {
    mockFetchFavourites.mockResolvedValue([]);

    renderFavouritesPage();

    expect(
      await screen.findByTestId("favourites-empty-title"),
    ).toHaveTextContent("Nothing saved yet");
    expect(
      screen.queryByTestId("favourites-search-input"),
    ).not.toBeInTheDocument();
  });

  it("filters the grid as you type", async () => {
    mockFetchFavourites.mockResolvedValue([
      drink("1", "Negroni"),
      drink("2", "Margarita"),
    ]);

    renderFavouritesPage();
    await screen.findByTestId("favourites-grid");

    await userEvent.type(screen.getByTestId("favourites-search-input"), "marg");

    expect(cardNames()).toEqual(["Margarita"]);
  });

  it("clears the filter from the clear button", async () => {
    mockFetchFavourites.mockResolvedValue([
      drink("1", "Negroni"),
      drink("2", "Margarita"),
    ]);

    renderFavouritesPage();
    await screen.findByTestId("favourites-grid");
    expect(
      screen.queryByTestId("favourites-search-clear"),
    ).not.toBeInTheDocument();

    await userEvent.type(screen.getByTestId("favourites-search-input"), "marg");
    await userEvent.click(screen.getByTestId("favourites-search-clear"));

    expect(screen.getByTestId("favourites-search-input")).toHaveValue("");
    expect(cardNames()).toEqual(["Negroni", "Margarita"]);
  });

  it("shows a no-match state when the filter matches nothing", async () => {
    mockFetchFavourites.mockResolvedValue([drink("1", "Negroni")]);

    renderFavouritesPage();
    await screen.findByTestId("favourites-grid");

    await userEvent.type(screen.getByTestId("favourites-search-input"), "zzz");

    expect(screen.getByTestId("favourites-empty-title")).toHaveTextContent(
      "Nothing on the shelf",
    );
    expect(screen.getByTestId("favourites-empty-message")).toHaveTextContent(
      "No favourites match “zzz”",
    );
  });

  it("shows the error when favourites fail to load", async () => {
    mockFetchFavourites.mockRejectedValue(new Error("500 Server Error"));

    renderFavouritesPage();

    expect(
      await screen.findByTestId("favourites-error-message"),
    ).toHaveTextContent("500 Server Error");
  });

  it("sends a signed-out visitor to the login page", () => {
    vi.mocked(authClient.useSession).mockReturnValue(sessionState(null));

    renderFavouritesPage();

    expect(screen.getByTestId("login-page")).toBeInTheDocument();
    expect(mockFetchFavourites).not.toHaveBeenCalled();
  });
});
