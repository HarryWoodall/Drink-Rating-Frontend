import { screen } from "@testing-library/react";
import { FeedbackHistory } from "./FeedbackHistory";
import { fetchUserFeedback } from "../services/profileService";
import { renderWithProviders } from "@/test/utils";
import { makeDrink, makeUserFeedback } from "@/test/fixtures";

vi.mock("../services/profileService", () => ({ fetchUserFeedback: vi.fn() }));

describe("FeedbackHistory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows skeletons while loading", () => {
    vi.mocked(fetchUserFeedback).mockReturnValue(new Promise(() => {}));

    renderWithProviders(<FeedbackHistory />);

    expect(screen.getByTestId("feedback-history-loading")).toBeInTheDocument();
  });

  it("shows the error message", async () => {
    vi.mocked(fetchUserFeedback).mockRejectedValue(new Error("401"));

    renderWithProviders(<FeedbackHistory />);

    expect(
      await screen.findByTestId("feedback-history-error"),
    ).toHaveTextContent("401");
  });

  it("says when the user hasn't left feedback", async () => {
    vi.mocked(fetchUserFeedback).mockResolvedValue([]);

    renderWithProviders(<FeedbackHistory />);

    expect(
      await screen.findByTestId("feedback-history-empty"),
    ).toHaveTextContent("You haven't left any feedback yet.");
  });

  it("lists each review with a link to its drink", async () => {
    vi.mocked(fetchUserFeedback).mockResolvedValue([
      makeUserFeedback({
        id: 1,
        drinkId: "11007",
        comment: "Sharp.",
        drink: makeDrink({ name: "Margarita" }),
      }),
      makeUserFeedback({
        id: 2,
        drinkId: "11003",
        comment: "Bitter.",
        drink: makeDrink({ id: "11003", name: "Negroni" }),
      }),
    ]);

    renderWithProviders(<FeedbackHistory />);

    const items = await screen.findAllByTestId("feedback-history-item");
    expect(items).toHaveLength(2);

    const links = screen.getAllByTestId("feedback-history-item-link");
    expect(links.map((l) => l.textContent)).toEqual(["Margarita", "Negroni"]);
    expect(links[1]).toHaveAttribute("href", "/cocktail/11003");
    expect(
      screen
        .getAllByTestId("feedback-history-item-comment")
        .map((c) => c.textContent),
    ).toEqual(["Sharp.", "Bitter."]);
  });

  it("dates each review by when it was last updated", async () => {
    vi.mocked(fetchUserFeedback).mockResolvedValue([
      makeUserFeedback({ updatedAt: "2026-05-01T12:00:00Z" }),
    ]);

    renderWithProviders(<FeedbackHistory />);

    expect(
      await screen.findByTestId("feedback-history-item-date"),
    ).toHaveTextContent(
      new Date("2026-05-01T12:00:00Z").toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    );
  });

  it("shows stars only for rated reviews", async () => {
    vi.mocked(fetchUserFeedback).mockResolvedValue([
      makeUserFeedback({ id: 1, rating: 4 }),
      makeUserFeedback({ id: 2, rating: null }),
    ]);

    renderWithProviders(<FeedbackHistory />);
    await screen.findAllByTestId("feedback-history-item");

    expect(screen.getAllByTestId("star-rating")).toHaveLength(1);
    expect(screen.queryByTestId("star-rating-value")).not.toBeInTheDocument();
  });
});
