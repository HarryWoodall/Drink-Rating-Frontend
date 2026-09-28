import { act, screen } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";
import { CocktailPage } from "./CocktailPage";
import { fetchCocktailById, fetchFeedback } from "./services/drinkService";
import { authClient } from "@/lib/auth";
import { useRouteHistoryStore } from "@/store/routeHistoryStore";
import { renderWithProviders } from "@/test/utils";
import { makeDrink, sessionState } from "@/test/fixtures";

vi.mock("./services/drinkService", () => ({
  fetchCocktailById: vi.fn(),
  fetchFeedback: vi.fn(),
  postFeedback: vi.fn(),
  putFeedback: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({ authClient: { useSession: vi.fn() } }));

vi.mock("@/services/favouritesService", () => ({
  addFavourite: vi.fn(),
  removeFavourite: vi.fn(),
}));

const StubEventSource = globalThis.EventSource;
let opened: EventSource[] = [];

class RecordingEventSource extends StubEventSource {
  constructor(url: string | URL, init?: EventSourceInit) {
    super(url, init);
    opened.push(this);
  }
}

function renderCocktailPage(route = "/cocktail/11007") {
  return renderWithProviders(
    <Routes>
      <Route path="/cocktail/:name" element={<CocktailPage />} />
    </Routes>,
    { route },
  );
}

describe("CocktailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    opened = [];
    vi.stubGlobal("EventSource", RecordingEventSource);
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.mocked(authClient.useSession).mockReturnValue(sessionState());
    vi.mocked(fetchCocktailById).mockResolvedValue(
      makeDrink({ favourite: false }),
    );
    vi.mocked(fetchFeedback).mockResolvedValue({
      userHasCommented: false,
      feedback: [],
    });
  });

  afterEach(() => {
    vi.stubGlobal("EventSource", StubEventSource);
  });

  it("shows a skeleton while the drink loads", () => {
    vi.mocked(fetchCocktailById).mockReturnValue(new Promise(() => {}));

    renderCocktailPage();

    expect(screen.getByTestId("cocktail-page-loading")).toBeInTheDocument();
    expect(screen.queryByTestId("cocktail-page-drink")).not.toBeInTheDocument();
  });

  it("shows the drink's details", async () => {
    renderCocktailPage();

    expect(await screen.findByTestId("cocktail-page-name")).toHaveTextContent(
      "Margarita",
    );
    expect(screen.getByTestId("cocktail-page-meta")).toHaveTextContent(
      "Ordinary Drink · Alcoholic · Cocktail glass",
    );

    const image = screen.getByTestId("cocktail-page-image");
    expect(image).toHaveAttribute("src", "https://example.test/margarita.jpg");
    expect(image).toHaveAccessibleName("Margarita");
    expect(fetchCocktailById).toHaveBeenCalledWith("11007");
  });

  it("lists the ingredients with their measures", async () => {
    renderCocktailPage();
    await screen.findByTestId("cocktail-page-ingredients");

    expect(
      screen
        .getAllByTestId("cocktail-page-ingredient-name")
        .map((n) => n.textContent),
    ).toEqual(["Tequila", "Lime juice"]);
    expect(
      screen
        .getAllByTestId("cocktail-page-ingredient-measure")
        .map((m) => m.textContent),
    ).toEqual(["50ml", "15ml"]);
  });

  it("omits a missing measure", async () => {
    vi.mocked(fetchCocktailById).mockResolvedValue(
      makeDrink({ ingredients: [{ id: 1, name: "Soda", measure: null }] }),
    );

    renderCocktailPage();

    expect(
      await screen.findByTestId("cocktail-page-ingredient-name"),
    ).toHaveTextContent("Soda");
    expect(
      screen.queryByTestId("cocktail-page-ingredient-measure"),
    ).not.toBeInTheDocument();
  });

  it("shows the method", async () => {
    renderCocktailPage();

    expect(await screen.findByTestId("cocktail-page-method")).toHaveTextContent(
      "Shake with ice, strain into a salt-rimmed glass.",
    );
  });

  it("leaves the method out when there are no instructions", async () => {
    vi.mocked(fetchCocktailById).mockResolvedValue(
      makeDrink({ instructions: "" }),
    );

    renderCocktailPage();
    await screen.findByTestId("cocktail-page-name");

    expect(screen.queryByTestId("cocktail-page-method")).not.toBeInTheDocument();
  });

  it("offers the favourite button and the review section", async () => {
    renderCocktailPage();

    expect(await screen.findByTestId("favourite-button")).toBeInTheDocument();
    expect(
      await screen.findByTestId("create-feedback-trigger"),
    ).toBeInTheDocument();
  });

  it("decodes the drink name from the URL", async () => {
    renderCocktailPage("/cocktail/Pi%C3%B1a%20Colada");

    await screen.findByTestId("cocktail-page-name");
    expect(fetchCocktailById).toHaveBeenCalledWith("Piña Colada");
  });

  it("shows a not-found state when the drink doesn't exist", async () => {
    vi.mocked(fetchCocktailById).mockRejectedValue(new Error("404 Not Found"));

    renderCocktailPage("/cocktail/Nope");

    expect(
      await screen.findByTestId("cocktail-page-not-found"),
    ).toHaveTextContent("We couldn't find “Nope” on the shelf.");
    expect(
      screen.getByTestId("cocktail-page-not-found-home-link"),
    ).toHaveAttribute("href", "/");
  });

  it("shows a back link and registers itself for the next page's back link", async () => {
    renderCocktailPage();

    expect(screen.getByTestId("back-link")).toBeInTheDocument();
    expect(useRouteHistoryStore.getState().currentBackText).toBe(
      "Back to cocktail",
    );
  });

  describe("watching now", () => {
    function emitUsers(count: number) {
      const data = Array.from({ length: count }, (_, i) => ({
        id: `u${i}`,
        name: `User ${i}`,
      }));
      act(() => {
        opened[0].onmessage?.(
          new MessageEvent("message", {
            data: JSON.stringify({ event: "room", data }),
          }),
        );
      });
    }

    it("subscribes to the drink's room", async () => {
      renderCocktailPage();
      await screen.findByTestId("cocktail-page-name");

      expect(opened[0].url).toBe("/api/events/cocktail/11007");
    });

    it("stays hidden while the user is alone", async () => {
      renderCocktailPage();
      await screen.findByTestId("cocktail-page-name");

      emitUsers(1);

      expect(
        screen.queryByTestId("cocktail-page-watching"),
      ).not.toBeInTheDocument();
    });

    it("shows how many people are viewing the drink", async () => {
      renderCocktailPage();
      await screen.findByTestId("cocktail-page-name");

      emitUsers(3);

      expect(screen.getByTestId("cocktail-page-watching")).toHaveTextContent(
        "3 watching now",
      );
    });
  });
});
