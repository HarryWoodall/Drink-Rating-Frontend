import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FavouriteButton } from "./FavouriteButton";
import { authClient } from "@/lib/auth";
import { addFavourite, removeFavourite } from "@/services/favouritesService";
import { renderWithProviders } from "@/test/utils";
import { makeDrink, sessionState } from "@/test/fixtures";

vi.mock("@/lib/auth", () => ({ authClient: { useSession: vi.fn() } }));

vi.mock("@/services/favouritesService", () => ({
  addFavourite: vi.fn(),
  removeFavourite: vi.fn(),
}));

describe("FavouriteButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authClient.useSession).mockReturnValue(sessionState());
    vi.mocked(addFavourite).mockResolvedValue();
    vi.mocked(removeFavourite).mockResolvedValue();
  });

  it("renders nothing for a signed-out visitor", () => {
    vi.mocked(authClient.useSession).mockReturnValue(sessionState(null));

    renderWithProviders(<FavouriteButton cocktail={makeDrink()} />);

    expect(screen.queryByTestId("favourite-button")).not.toBeInTheDocument();
    expect(screen.queryByTestId("favourite-icon")).not.toBeInTheDocument();
  });

  it("renders nothing while the session is loading", () => {
    vi.mocked(authClient.useSession).mockReturnValue(
      sessionState(null, { pending: true }),
    );

    renderWithProviders(<FavouriteButton cocktail={makeDrink()} />);

    expect(screen.queryByTestId("favourite-button")).not.toBeInTheDocument();
  });

  it("offers to add a drink that isn't a favourite", async () => {
    renderWithProviders(
      <FavouriteButton cocktail={makeDrink({ favourite: false })} />,
    );

    const button = screen.getByTestId("favourite-button");
    expect(button).toHaveAccessibleName("Add to favourites");
    expect(button).toHaveAttribute("aria-pressed", "false");

    await userEvent.click(button);

    expect(addFavourite).toHaveBeenCalledWith("11007");
    expect(removeFavourite).not.toHaveBeenCalled();
  });

  it("offers to remove a drink that is a favourite", async () => {
    renderWithProviders(
      <FavouriteButton cocktail={makeDrink({ favourite: true })} />,
    );

    const button = screen.getByTestId("favourite-button");
    expect(button).toHaveAccessibleName("Remove from favourites");
    expect(button).toHaveAttribute("aria-pressed", "true");

    await userEvent.click(button);

    expect(removeFavourite).toHaveBeenCalledWith("11007");
  });

  it("treats a drink with no favourite flag as not favourited", () => {
    renderWithProviders(<FavouriteButton cocktail={makeDrink()} />);

    expect(screen.getByTestId("favourite-button")).toHaveAccessibleName(
      "Add to favourites",
    );
  });

  it("shows a tooltip describing the action on hover", async () => {
    renderWithProviders(
      <FavouriteButton cocktail={makeDrink({ favourite: false })} />,
    );

    await userEvent.hover(screen.getByTestId("favourite-button"));

    expect(
      await screen.findByTestId("favourite-button-tooltip"),
    ).toHaveTextContent("Add to favourites");
  });

  describe("readonly", () => {
    it("shows a non-interactive heart for a favourite", () => {
      renderWithProviders(
        <FavouriteButton cocktail={makeDrink({ favourite: true })} readonly />,
      );

      expect(screen.queryByTestId("favourite-button")).not.toBeInTheDocument();
      expect(screen.getByTestId("favourite-icon")).toBeInTheDocument();
    });

    it("renders nothing for a drink that isn't a favourite", () => {
      renderWithProviders(
        <FavouriteButton cocktail={makeDrink({ favourite: false })} readonly />,
      );

      expect(screen.queryByTestId("favourite-icon")).not.toBeInTheDocument();
    });
  });
});
