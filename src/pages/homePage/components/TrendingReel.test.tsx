import { screen } from "@testing-library/react";
import { TrendingReel } from "./TrendingReel";
import { authClient } from "@/lib/auth";
import { renderWithProviders } from "@/test/utils";
import { makeDrink, sessionState } from "@/test/fixtures";
import type { TrendingResponse } from "@/types/cocktail";

vi.mock("@/lib/auth", () => ({ authClient: { useSession: vi.fn() } }));

function trending(name: string, avgRating = 4, numRatings = 3): TrendingResponse {
  return {
    drink: makeDrink({ id: name, name }),
    avgRating,
    numRatings,
    numClients: 2,
  };
}

describe("TrendingReel", () => {
  beforeEach(() => {
    vi.mocked(authClient.useSession).mockReturnValue(sessionState(null));
  });

  it("shows a showcase card per trending drink", () => {
    renderWithProviders(
      <TrendingReel
        cocktails={[trending("Negroni"), trending("Paloma")]}
        loading={false}
        error={null}
      />,
    );

    expect(screen.getByTestId("section-heading-title")).toHaveTextContent(
      "Trending at the Bar",
    );
    expect(
      screen
        .getAllByTestId("drink-showcase-card-name")
        .map((n) => n.textContent),
    ).toEqual(["Negroni", "Paloma"]);
  });

  it("shows skeletons while loading", () => {
    renderWithProviders(
      <TrendingReel cocktails={[]} loading={true} error={null} />,
    );

    expect(screen.getAllByTestId("trending-skeleton")).toHaveLength(5);
    expect(screen.queryByTestId("trending-empty")).not.toBeInTheDocument();
  });

  it("invites the first pour when nothing is trending", () => {
    renderWithProviders(
      <TrendingReel cocktails={[]} loading={false} error={null} />,
    );

    expect(screen.getByTestId("trending-empty")).toHaveTextContent(
      "Nothing trending yet",
    );
  });

  it("shows the error above whatever it has", () => {
    renderWithProviders(
      <TrendingReel cocktails={[]} loading={false} error="500" />,
    );

    expect(screen.getByTestId("trending-error")).toHaveTextContent(
      "Failed to load trending pours.",
    );
  });
});
