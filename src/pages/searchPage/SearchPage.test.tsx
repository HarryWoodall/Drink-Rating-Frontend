import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useLocation } from "react-router-dom";
import { SearchPage } from "./SearchPage";
import {
  browseDrinks,
  searchCocktailsByIngredient,
  searchCocktailsByName,
} from "./services/searchService";
import { useRouteHistoryStore } from "@/store/routeHistoryStore";
import { renderWithProviders } from "@/test/utils";
import { makeDrink } from "@/test/fixtures";
import type { DrinkSearchResponse } from "@/types/cocktail";

vi.mock("./services/searchService", () => ({
  browseDrinks: vi.fn(),
  searchCocktailsByName: vi.fn(),
  searchCocktailsByIngredient: vi.fn(),
}));

function results(names: string[], pages = 1): DrinkSearchResponse {
  return {
    pagination: { totalResults: names.length, pages },
    drinks: names.map((name, i) => makeDrink({ id: String(i), name })),
  };
}

/** Exposes the current URL's query so tests can assert on navigation. */
function LocationProbe() {
  const { search } = useLocation();
  return <output data-testid="location-search">{search}</output>;
}

function currentParams() {
  return new URLSearchParams(
    screen.getByTestId("location-search").textContent ?? "",
  );
}

/** Names of the drinks currently shown in the results grid. */
function cardNames() {
  return screen
    .getAllByTestId("cocktail-card-name")
    .map((name) => name.textContent);
}

function renderSearchPage(route = "/search") {
  return renderWithProviders(
    <>
      <SearchPage />
      <LocationProbe />
    </>,
    { route },
  );
}

describe("SearchPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.mocked(browseDrinks).mockResolvedValue(results(["Mojito", "Negroni"]));
    vi.mocked(searchCocktailsByName).mockResolvedValue(results(["Margarita"]));
    vi.mocked(searchCocktailsByIngredient).mockResolvedValue(
      results(["Gin Fizz"]),
    );
  });

  it("browses every drink when there's no query", async () => {
    renderSearchPage();

    await screen.findByTestId("search-results");
    expect(cardNames()).toEqual(["Mojito", "Negroni"]);
    expect(screen.getByTestId("search-filters-result-count")).toHaveTextContent(
      "2 results",
    );
    expect(browseDrinks).toHaveBeenCalledWith(undefined, "All", 1, undefined);
  });

  it("searches by name from the q param", async () => {
    renderSearchPage("/search?q=marg");

    await screen.findByTestId("search-results");
    expect(cardNames()).toEqual(["Margarita"]);
    expect(screen.getByTestId("search-bar-input")).toHaveValue("marg");
    expect(searchCocktailsByName).toHaveBeenCalledWith(
      "marg",
      undefined,
      "All",
      1,
      undefined,
    );
  });

  it("searches by ingredient with the filters from the URL", async () => {
    renderSearchPage(
      "/search?q=gin&type=ingredient&filter=alcoholic&category=Cocktail&page=2",
    );

    await screen.findByTestId("search-results");
    expect(cardNames()).toEqual(["Gin Fizz"]);
    expect(searchCocktailsByIngredient).toHaveBeenCalledWith(
      "gin",
      true,
      "Cocktail",
      2,
      undefined,
    );
  });

  it("says so when a search finds nothing", async () => {
    vi.mocked(searchCocktailsByName).mockResolvedValue(results([]));

    renderSearchPage("/search?q=zzz");

    expect(await screen.findByTestId("search-results-empty")).toHaveTextContent(
      "No results for “zzz”",
    );
  });

  it("puts the trimmed query in the URL on submit", async () => {
    renderSearchPage();
    await screen.findByTestId("search-results");

    await userEvent.type(
      screen.getByTestId("search-bar-input"),
      "  negroni  {Enter}",
    );

    await waitFor(() => expect(currentParams().get("q")).toBe("negroni"));
    await waitFor(() =>
      expect(searchCocktailsByName).toHaveBeenCalledWith(
        "negroni",
        undefined,
        "All",
        1,
        undefined,
      ),
    );
  });

  it("clears the query when submitting an empty search", async () => {
    renderSearchPage("/search?q=marg");
    await screen.findByTestId("search-results");

    await userEvent.clear(screen.getByTestId("search-bar-input"));
    await userEvent.keyboard("{Enter}");

    await waitFor(() => expect(currentParams().has("q")).toBe(false));
  });

  it("resets to page 1 when the alcohol filter changes", async () => {
    renderSearchPage("/search?page=3");
    await screen.findByTestId("search-results");

    await userEvent.click(screen.getByTestId("alcohol-filter-non-alcoholic"));

    await waitFor(() => {
      expect(currentParams().get("filter")).toBe("non-alcoholic");
      expect(currentParams().get("page")).toBe("1");
    });
  });

  it("changes page from the pagination", async () => {
    vi.mocked(browseDrinks).mockResolvedValue(results(["Mojito"], 5));

    renderSearchPage();
    await screen.findByTestId("search-results");

    await userEvent.click(screen.getByTestId("pagination-next"));

    await waitFor(() => expect(currentParams().get("page")).toBe("2"));
    await waitFor(() =>
      expect(browseDrinks).toHaveBeenLastCalledWith(
        undefined,
        "All",
        2,
        undefined,
      ),
    );
  });

  it("registers itself as the page to come back to", async () => {
    renderSearchPage("/search?q=marg");
    await screen.findByTestId("search-results");

    expect(useRouteHistoryStore.getState().currentBackText).toBe(
      "Back to search",
    );
  });

  // The page returns null until the first results arrive, so a failed first
  // search never reaches ResultsSection's error state. Pins current behaviour.
  it("renders nothing when the first search fails", async () => {
    vi.mocked(searchCocktailsByName).mockRejectedValue(
      new Error("500 Server Error"),
    );

    renderSearchPage("/search?q=marg");

    await waitFor(() => expect(searchCocktailsByName).toHaveBeenCalled());
    expect(screen.queryByTestId("search-page")).not.toBeInTheDocument();
    expect(screen.queryByTestId("search-results-error")).not.toBeInTheDocument();
  });
});
