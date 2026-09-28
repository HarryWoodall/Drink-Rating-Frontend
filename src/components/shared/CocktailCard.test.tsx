import { renderWithProviders } from "@/test/utils";
import { CocktailCard } from "./CocktailCard";
import { alcoholicLabel, Drink } from "@/types/cocktail";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("CocktailCard", () => {
  let drink: Drink | null = null;

  beforeEach(() => {
    drink = {
      id: "11007",
      name: "Margarita",
      image: "https://example.test/margarita.jpg",
      category: "Ordinary Drink",
      alcoholic: true,
      glass: "Cocktail glass",
      instructions: "Shake with ice, strain into a salt-rimmed glass.",
      tags: null,
      ingredients: [
        { id: 1, name: "Tequila", measure: "50ml" },
        { id: 2, name: "Lime juice", measure: "15ml" },
      ],
    };
  });

  it("CocktailCard renders with default params", async () => {
    renderWithProviders(<CocktailCard drink={drink!} />);

    const cardItems = getCardItems();

    expect(cardItems.card).toBeInTheDocument();

    expect(cardItems.link).toBeInTheDocument();
    expect(cardItems.link).toHaveAttribute("href", "/cocktail/11007");

    expect(cardItems.image).toBeInTheDocument();
    expect(cardItems.image).toHaveAttribute(
      "src",
      "https://example.test/margarita.jpg",
    );
    expect(cardItems.image).toHaveAccessibleName("Margarita");

    expect(cardItems.category).toBeInTheDocument();
    expect(cardItems.category).toHaveTextContent("Ordinary Drink");

    expect(cardItems.name).toBeInTheDocument();
    expect(cardItems.name).toHaveTextContent("Margarita");

    expect(cardItems.alcoholicLabel).toBeInTheDocument();
    expect(cardItems.alcoholicLabel).toHaveTextContent(alcoholicLabel(true));

    expect(cardItems.placeholderImage).not.toBeInTheDocument();
    expect(cardItems.action).not.toBeInTheDocument();
  });

  it("CocktailCard renders with action", async () => {
    renderWithProviders(
      <CocktailCard drink={drink!} action={<div>action</div>} />,
    );

    const cardItems = getCardItems();

    expect(cardItems.action).toBeInTheDocument();
  });

  it("CocktailCard renders with placeholder image, if image is not defined", async () => {
    drink!.image = "";

    renderWithProviders(
      <CocktailCard drink={drink!} action={<div>action</div>} />,
    );

    const cardItems = getCardItems();

    expect(cardItems.placeholderImage).toBeInTheDocument();
  });

  it("lets the action be clicked without following the card's link", async () => {
    const onClick = vi.fn();

    renderWithProviders(
      <CocktailCard
        drink={drink!}
        action={
          <button onClick={onClick} data-testid="action-button">
            Favourite
          </button>
        }
      />,
    );

    const favouriteButton = screen.getByTestId("action-button");

    await userEvent.click(favouriteButton);

    expect(onClick).toHaveBeenCalledOnce();
  });

  it("labels a non-alcoholic drink", () => {
    drink!.alcoholic = false;

    renderWithProviders(<CocktailCard drink={drink!} />);

    expect(getCardItems().alcoholicLabel).toHaveTextContent("Non-alcoholic");
  });

  it("renders the action outside the link so it isn't nested in an anchor", () => {
    renderWithProviders(
      <CocktailCard drink={drink!} action={<button>Favourite</button>} />,
    );

    const card = getCardItems();

    expect(card.action).toBeInTheDocument();
    expect(card.link).not.toContainElement(card.action);
  });
});

function getCardItems() {
  const card = screen.queryByTestId("cocktail-card");
  const link = screen.queryByTestId("cocktail-card-link");
  const image = screen.queryByTestId("cocktail-card-image");
  const placeholderImage = screen.queryByTestId(
    "cocktail-card-image-placeholder",
  );
  const category = screen.queryByTestId("cocktail-card-category");
  const name = screen.queryByTestId("cocktail-card-name");
  const alcoholicLabel = screen.queryByTestId(
    "cocktail-card-isAlcoholic-label",
  );
  const action = screen.queryByTestId("cocktail-card-action");

  return {
    card,
    link,
    image,
    placeholderImage,
    category,
    name,
    alcoholicLabel,
    action,
  };
}
