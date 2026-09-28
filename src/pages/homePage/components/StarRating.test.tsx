import { screen } from "@testing-library/react";
import { StarRating } from "./StarRating";
import { renderWithProviders } from "@/test/utils";

describe("StarRating", () => {
  it.each([
    [0, 0],
    [2.4, 2],
    [2.5, 3],
    [4.49, 4],
    [5, 5],
  ])("rounds %s to %s filled stars", (rating, filled) => {
    renderWithProviders(<StarRating rating={rating} />);

    expect(screen.queryAllByTestId("star-rating-star-filled")).toHaveLength(
      filled,
    );
    expect(screen.queryAllByTestId("star-rating-star-empty")).toHaveLength(
      5 - filled,
    );
  });

  it("shows the rating to one decimal place", () => {
    renderWithProviders(<StarRating rating={4} />);

    expect(screen.getByTestId("star-rating-value")).toHaveTextContent("4.0");
    expect(screen.queryByTestId("star-rating-count")).not.toBeInTheDocument();
  });

  it("shows how many ratings it's based on", () => {
    renderWithProviders(<StarRating rating={3.7} numRatings={12} />);

    expect(screen.getByTestId("star-rating-count")).toHaveTextContent("(12)");
  });

  it("can hide the value and count", () => {
    renderWithProviders(
      <StarRating rating={3.7} numRatings={12} showValue={false} />,
    );

    expect(screen.getByTestId("star-rating")).toBeInTheDocument();
    expect(screen.queryByTestId("star-rating-value")).not.toBeInTheDocument();
    expect(screen.queryByTestId("star-rating-count")).not.toBeInTheDocument();
  });

  it("says a drink with no ratings is not yet rated", () => {
    renderWithProviders(<StarRating rating={0} numRatings={0} />);

    expect(screen.getByTestId("star-rating-unrated")).toHaveTextContent(
      "Not yet rated",
    );
    expect(screen.queryByTestId("star-rating")).not.toBeInTheDocument();
  });
});
