import { screen } from "@testing-library/react";
import { DrinkShowcaseCard } from "./DrinkShowcaseCard";
import { authClient } from "@/lib/auth";
import { renderWithProviders } from "@/test/utils";
import { makeDrink, sessionState } from "@/test/fixtures";

vi.mock("@/lib/auth", () => ({ authClient: { useSession: vi.fn() } }));

describe("DrinkShowcaseCard", () => {
  beforeEach(() => {
    vi.mocked(authClient.useSession).mockReturnValue(sessionState(null));
  });

  it("shows the drink's name, image and rating", () => {
    renderWithProviders(
      <DrinkShowcaseCard drink={makeDrink()} avgRating={4.2} numRatings={7} />,
    );

    expect(screen.getByTestId("drink-showcase-card-name")).toHaveTextContent(
      "Margarita",
    );
    const image = screen.getByTestId("drink-showcase-card-image");
    expect(image).toHaveAttribute("src", "https://example.test/margarita.jpg");
    expect(image).toHaveAccessibleName("Margarita");
    expect(screen.getByTestId("star-rating-value")).toHaveTextContent("4.2");
    expect(screen.getByTestId("star-rating-count")).toHaveTextContent("(7)");
  });

  it("lists the searched-for ingredients first", () => {
    renderWithProviders(
      <DrinkShowcaseCard
        drink={makeDrink({
          ingredients: [
            { id: 1, name: "Lime juice", measure: null },
            { id: 2, name: "Gin", measure: null, searchItems: true },
            { id: 3, name: "Sugar", measure: null },
          ],
        })}
        avgRating={4}
        numRatings={1}
      />,
    );

    expect(
      screen
        .getAllByTestId("drink-showcase-card-ingredient")
        .map((i) => i.textContent),
    ).toEqual(["Gin", "Lime juice", "Sugar"]);
  });

  it("says a drink with no ratings is not yet rated", () => {
    renderWithProviders(
      <DrinkShowcaseCard drink={makeDrink()} avgRating={0} numRatings={0} />,
    );

    expect(screen.getByTestId("star-rating-unrated")).toBeInTheDocument();
  });

  it("marks a favourite for a signed-in user", () => {
    vi.mocked(authClient.useSession).mockReturnValue(sessionState());

    renderWithProviders(
      <DrinkShowcaseCard
        drink={makeDrink({ favourite: true })}
        avgRating={4}
        numRatings={1}
      />,
    );

    expect(screen.getByTestId("favourite-icon")).toBeInTheDocument();
    // Read-only inside a card — the card itself is the link.
    expect(screen.queryByTestId("favourite-button")).not.toBeInTheDocument();
  });
});
