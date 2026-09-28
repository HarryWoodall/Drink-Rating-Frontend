import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RandomDrink } from "./RandomDrinkCard";
import { authClient } from "@/lib/auth";
import { renderWithProviders } from "@/test/utils";
import { makeDrink, sessionState } from "@/test/fixtures";

vi.mock("@/lib/auth", () => ({ authClient: { useSession: vi.fn() } }));

function renderRandomDrink(
  props: Partial<React.ComponentProps<typeof RandomDrink>> = {},
) {
  const onShuffle = vi.fn();

  renderWithProviders(
    <RandomDrink
      drink={makeDrink()}
      loading={false}
      error={null}
      onShuffle={onShuffle}
      {...props}
    />,
  );

  return onShuffle;
}

describe("RandomDrink", () => {
  beforeEach(() => {
    vi.mocked(authClient.useSession).mockReturnValue(sessionState(null));
  });

  it("renders nothing until there's a drink", () => {
    renderRandomDrink({ drink: null });

    expect(
      screen.queryByTestId("random-drink-section"),
    ).not.toBeInTheDocument();
  });

  it("shows the drink's name, description, ingredients and method", () => {
    renderRandomDrink();

    expect(screen.getByTestId("section-heading-title")).toHaveTextContent(
      "Pour Me Something",
    );
    expect(screen.getByTestId("random-drink-name")).toHaveTextContent(
      "Margarita",
    );
    expect(screen.getByTestId("drink-description")).toHaveTextContent(
      "Ordinary Drink · Alcoholic",
    );
    expect(screen.getByTestId("drink-ingredients")).toHaveTextContent(
      "Tequila, Lime juice",
    );
    expect(screen.getByTestId("random-drink-instructions")).toHaveTextContent(
      "Shake with ice",
    );
    // One image per breakpoint layout.
    screen
      .getAllByTestId("random-drink-image")
      .forEach((img) =>
        expect(img).toHaveAttribute("src", "https://example.test/margarita.jpg"),
      );
  });

  it("links through to the drink", () => {
    renderRandomDrink();

    expect(screen.getByTestId("random-drink-view-link")).toHaveAttribute(
      "href",
      "/cocktail/11007",
    );
  });

  it("shuffles on demand", async () => {
    const onShuffle = renderRandomDrink();

    await userEvent.click(screen.getByTestId("random-drink-shuffle"));

    expect(onShuffle).toHaveBeenCalledOnce();
  });

  it("disables shuffling while the next drink is fetched", () => {
    renderRandomDrink({ fetching: true });

    expect(screen.getByTestId("random-drink-shuffle")).toBeDisabled();
  });

  it("shows skeletons instead of details while loading", () => {
    renderRandomDrink({ loading: true });

    expect(
      screen.getByTestId("random-drink-content-skeleton"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("random-drink-image-skeleton"),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("random-drink-name")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("random-drink-instructions"),
    ).not.toBeInTheDocument();
  });

  it("invites another shuffle when the pour fails", () => {
    renderRandomDrink({ error: "503" });

    expect(screen.getByTestId("random-drink-error")).toHaveTextContent(
      "Try shuffling again",
    );
    expect(screen.queryByTestId("random-drink-name")).not.toBeInTheDocument();
    expect(screen.getByTestId("random-drink-shuffle")).toBeEnabled();
  });

  it("marks a favourited drink for a signed-in user", () => {
    vi.mocked(authClient.useSession).mockReturnValue(sessionState());

    renderRandomDrink({ drink: makeDrink({ favourite: true }) });

    expect(screen.getAllByTestId("favourite-icon").length).toBeGreaterThan(0);
  });
});
