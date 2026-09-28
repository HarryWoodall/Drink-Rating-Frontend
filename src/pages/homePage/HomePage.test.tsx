import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HomePage } from "./HomePage";
import {
  fetchRandomDrink,
  fetchTopIngredients,
  fetchTopRatedDrinks,
} from "./services/homeService";
import { authClient } from "@/lib/auth";
import { useRouteHistoryStore } from "@/store/routeHistoryStore";
import { renderWithProviders } from "@/test/utils";
import { makeDrink, makeTopRated, sessionState } from "@/test/fixtures";

vi.mock("./services/homeService", () => ({
  fetchRandomDrink: vi.fn(),
  fetchTopRatedDrinks: vi.fn(),
  fetchTopIngredients: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({ authClient: { useSession: vi.fn() } }));

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authClient.useSession).mockReturnValue(sessionState(null));
    vi.mocked(fetchRandomDrink).mockResolvedValue(makeDrink());
    vi.mocked(fetchTopRatedDrinks).mockResolvedValue([
      makeTopRated({ id: "1", name: "Negroni" }),
    ]);
    vi.mocked(fetchTopIngredients).mockResolvedValue([]);
  });

  it("renders the hero and every section", async () => {
    renderWithProviders(<HomePage />);

    expect(screen.getByTestId("hero")).toBeInTheDocument();
    expect(await screen.findByTestId("random-drink-name")).toHaveTextContent(
      "Margarita",
    );
    expect(await screen.findByTestId("top-rated-card-name")).toHaveTextContent(
      "Negroni",
    );
    expect(
      screen.getByTestId("ingredient-showcase-section"),
    ).toBeInTheDocument();
  });

  it("pours a new random drink on shuffle", async () => {
    vi.mocked(fetchRandomDrink)
      .mockResolvedValueOnce(makeDrink({ id: "1", name: "Margarita" }))
      .mockResolvedValueOnce(makeDrink({ id: "2", name: "Paloma" }));

    renderWithProviders(<HomePage />);
    await screen.findByTestId("random-drink-name");

    await userEvent.click(screen.getByTestId("random-drink-shuffle"));

    await waitFor(() =>
      expect(screen.getByTestId("random-drink-name")).toHaveTextContent(
        "Paloma",
      ),
    );
  });

  it("clears the back-link history, since home is the root", () => {
    useRouteHistoryStore.getState().setPath("/favourites", "Back to favourites");
    useRouteHistoryStore.getState().setPath("/about", "Back to about");

    renderWithProviders(<HomePage />);

    const state = useRouteHistoryStore.getState();
    expect(state.currentBackText).toBe("Home");
    expect(state.previousPath).toBeNull();
  });
});
