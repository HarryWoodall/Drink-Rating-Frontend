import { screen } from "@testing-library/react";
import { CommentItem } from "./CommentItem";
import { authClient } from "@/lib/auth";
import { renderWithProviders } from "@/test/utils";
import { makeFeedback, sessionState, testUser } from "@/test/fixtures";

vi.mock("@/lib/auth", () => ({ authClient: { useSession: vi.fn() } }));

vi.mock("@/pages/drink/services/drinkService", () => ({ putFeedback: vi.fn() }));

describe("CommentItem", () => {
  beforeEach(() => {
    vi.mocked(authClient.useSession).mockReturnValue(sessionState());
  });

  it("shows the author, date and comment", () => {
    renderWithProviders(<CommentItem feedback={makeFeedback()} />);

    expect(screen.getByTestId("comment-item-name")).toHaveTextContent(
      "Sam Taylor",
    );
    expect(screen.getByTestId("comment-item-comment")).toHaveTextContent(
      "Lovely and sharp.",
    );
    expect(screen.getByTestId("comment-item-date")).toHaveTextContent(
      new Date("2026-03-14T12:00:00Z").toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    );
  });

  it("falls back to Anonymous when the author was deleted", () => {
    renderWithProviders(
      <CommentItem feedback={makeFeedback({ user: null, userId: null })} />,
    );

    expect(screen.getByTestId("comment-item-name")).toHaveTextContent(
      "Anonymous",
    );
  });

  it("fills one star per rating point", () => {
    renderWithProviders(<CommentItem feedback={makeFeedback({ rating: 3 })} />);

    expect(screen.getAllByTestId("comment-item-star-filled")).toHaveLength(3);
    expect(screen.getAllByTestId("comment-item-star-empty")).toHaveLength(2);
  });

  it("omits the stars for an unrated comment", () => {
    renderWithProviders(
      <CommentItem feedback={makeFeedback({ rating: null })} />,
    );

    expect(screen.queryByTestId("comment-item-rating")).not.toBeInTheDocument();
  });

  it("lets the author edit their own comment", () => {
    renderWithProviders(
      <CommentItem
        feedback={makeFeedback({
          user: { id: testUser.id, name: testUser.name, image: null },
        })}
      />,
    );

    expect(
      screen.getByTestId("update-feedback-trigger-inline"),
    ).toHaveAccessibleName("Edit your review");
  });

  it("doesn't offer an edit on someone else's comment", () => {
    renderWithProviders(<CommentItem feedback={makeFeedback()} />);

    expect(
      screen.queryByTestId("update-feedback-trigger-inline"),
    ).not.toBeInTheDocument();
  });

  it("doesn't offer an edit when signed out", () => {
    vi.mocked(authClient.useSession).mockReturnValue(sessionState(null));

    renderWithProviders(<CommentItem feedback={makeFeedback()} />);

    expect(
      screen.queryByTestId("update-feedback-trigger-inline"),
    ).not.toBeInTheDocument();
  });
});
