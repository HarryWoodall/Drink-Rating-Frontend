import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CommentSection } from "./CommentSection";
import { authClient } from "@/lib/auth";
import { fetchFeedback } from "@/pages/drink/services/drinkService";
import { renderWithProviders } from "@/test/utils";
import { makeFeedback, sessionState, testUser } from "@/test/fixtures";

vi.mock("@/lib/auth", () => ({ authClient: { useSession: vi.fn() } }));

vi.mock("@/pages/drink/services/drinkService", () => ({
  fetchFeedback: vi.fn(),
  postFeedback: vi.fn(),
  putFeedback: vi.fn(),
}));

describe("CommentSection", () => {
  beforeEach(() => {
    vi.mocked(authClient.useSession).mockReturnValue(sessionState());
  });

  it("renders nothing until the feedback has loaded", () => {
    vi.mocked(fetchFeedback).mockReturnValue(new Promise(() => {}));

    renderWithProviders(<CommentSection drinkId="11007" />);

    expect(
      screen.queryByTestId("comment-section-verdict"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("comment-section-comments"),
    ).not.toBeInTheDocument();
  });

  it("offers a new review when the user hasn't left one", async () => {
    vi.mocked(fetchFeedback).mockResolvedValue({
      userHasCommented: false,
      feedback: [makeFeedback()],
    });

    renderWithProviders(<CommentSection drinkId="11007" />);

    expect(
      await screen.findByTestId("create-feedback-trigger"),
    ).toHaveTextContent("Rate & Review");
    expect(
      screen.queryByTestId("update-feedback-trigger"),
    ).not.toBeInTheDocument();
    expect(screen.getByTestId("comment-item-comment")).toHaveTextContent(
      "Lovely and sharp.",
    );
  });

  it("offers to update the user's existing review, pre-filled", async () => {
    vi.mocked(fetchFeedback).mockResolvedValue({
      userHasCommented: true,
      feedback: [
        makeFeedback({ id: 1, userId: "u2" }),
        makeFeedback({
          id: 2,
          userId: testUser.id,
          comment: "My own take.",
          user: { id: testUser.id, name: testUser.name, image: null },
        }),
      ],
    });

    renderWithProviders(<CommentSection drinkId="11007" />);

    await userEvent.click(await screen.findByTestId("update-feedback-trigger"));

    expect(await screen.findByTestId("feedback-modal-comment")).toHaveValue(
      "My own take.",
    );
    expect(
      screen.queryByTestId("create-feedback-trigger"),
    ).not.toBeInTheDocument();
  });
});
