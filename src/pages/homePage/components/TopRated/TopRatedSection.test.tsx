import { screen } from "@testing-library/react";
import { TopRatedSection } from "./TopRatedSection";
import { authClient } from "@/lib/auth";
import { renderWithProviders } from "@/test/utils";
import { makeTopRated, sessionState } from "@/test/fixtures";

vi.mock("@/lib/auth", () => ({ authClient: { useSession: vi.fn() } }));

const ranked = [
  makeTopRated({ id: "1", name: "Negroni" }, 4.9, 30),
  makeTopRated({ id: "2", name: "Margarita" }, 4.6, 12),
  makeTopRated({ id: "3", name: "Mojito", image: "" }, 4.2, 8),
  makeTopRated({ id: "4", name: "Daiquiri" }, 4.0, 5),
  makeTopRated({ id: "5", name: "Sazerac" }, 3.8, 2),
];

describe("TopRatedSection", () => {
  beforeEach(() => {
    vi.mocked(authClient.useSession).mockReturnValue(sessionState(null));
  });

  it("features the top drink and ranks the next four", () => {
    renderWithProviders(
      <TopRatedSection
        topRatedResponseList={ranked}
        loading={false}
        error={null}
      />,
    );

    expect(screen.getByTestId("section-heading-title")).toHaveTextContent(
      "The Top Shelf",
    );

    expect(screen.getByTestId("top-rated-card-name")).toHaveTextContent(
      "Negroni",
    );
    expect(screen.getByTestId("top-rated-card")).toHaveAttribute(
      "href",
      "/cocktail/1",
    );

    expect(
      screen.getAllByTestId("rated-card-name").map((n) => n.textContent),
    ).toEqual(["Margarita", "Mojito", "Daiquiri", "Sazerac"]);
    expect(
      screen.getAllByTestId("rated-card-rank").map((r) => r.textContent),
    ).toEqual(["2.", "3.", "4.", "5."]);
  });

  it("shows the featured drink's rating, description and method", () => {
    renderWithProviders(
      <TopRatedSection
        topRatedResponseList={ranked}
        loading={false}
        error={null}
      />,
    );

    const [featuredRating] = screen.getAllByTestId("star-rating-value");
    expect(featuredRating).toHaveTextContent("4.9");
    expect(screen.getByTestId("drink-description")).toHaveTextContent(
      "Ordinary Drink · Alcoholic",
    );
    expect(screen.getByTestId("top-rated-card-instructions")).toHaveTextContent(
      "Shake with ice",
    );
  });

  it("falls back to a placeholder for a drink without an image", () => {
    renderWithProviders(
      <TopRatedSection
        topRatedResponseList={ranked}
        loading={false}
        error={null}
      />,
    );

    expect(screen.getAllByTestId("rated-card-image")).toHaveLength(3);
    expect(screen.getAllByTestId("rated-card-image-placeholder")).toHaveLength(
      1,
    );
  });

  it("copes with fewer than five rated drinks", () => {
    renderWithProviders(
      <TopRatedSection
        topRatedResponseList={ranked.slice(0, 2)}
        loading={false}
        error={null}
      />,
    );

    expect(screen.getByTestId("top-rated-card")).toBeInTheDocument();
    expect(screen.getAllByTestId("rated-card")).toHaveLength(1);
  });

  it("shows a skeleton while loading", () => {
    renderWithProviders(
      <TopRatedSection
        topRatedResponseList={undefined}
        loading={true}
        error={null}
      />,
    );

    expect(screen.getByTestId("top-rated-loading")).toBeInTheDocument();
    expect(screen.queryByTestId("top-rated-card")).not.toBeInTheDocument();
  });

  it("invites the first review when nothing is rated", () => {
    renderWithProviders(
      <TopRatedSection
        topRatedResponseList={undefined}
        loading={false}
        error={null}
      />,
    );

    expect(screen.getByTestId("top-rated-empty")).toHaveTextContent(
      "No cocktails rated yet",
    );
  });

  it("shows the error", () => {
    renderWithProviders(
      <TopRatedSection
        topRatedResponseList={ranked}
        loading={false}
        error="500"
      />,
    );

    expect(screen.getByTestId("top-rated-error")).toHaveTextContent(
      "Failed to load the top-rated cocktail.",
    );
    expect(screen.queryByTestId("top-rated-card")).not.toBeInTheDocument();
  });
});
