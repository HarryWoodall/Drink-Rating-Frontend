import { screen } from "@testing-library/react";
import { CommentList } from "./CommentList";
import { authClient } from "@/lib/auth";
import { renderWithProviders } from "@/test/utils";
import { makeFeedback, sessionState } from "@/test/fixtures";

vi.mock("@/lib/auth", () => ({ authClient: { useSession: vi.fn() } }));

describe("CommentList", () => {
  beforeEach(() => {
    vi.mocked(authClient.useSession).mockReturnValue(sessionState(null));
  });

  it("shows skeletons while loading", () => {
    renderWithProviders(
      <CommentList feedback={{ data: null, loading: true, error: null }} />,
    );

    expect(screen.getByTestId("comment-list-loading")).toBeInTheDocument();
    expect(screen.queryByTestId("comment-list-empty")).not.toBeInTheDocument();
  });

  it("invites the first comment when there are none", () => {
    renderWithProviders(
      <CommentList
        feedback={{
          data: { userHasCommented: false, feedback: [] },
          loading: false,
          error: null,
        }}
      />,
    );

    expect(screen.getByTestId("comment-list-empty")).toHaveTextContent(
      "No comments yet",
    );
  });

  it("renders a comment for each piece of feedback", () => {
    renderWithProviders(
      <CommentList
        feedback={{
          data: {
            userHasCommented: false,
            feedback: [
              makeFeedback({ id: 1, comment: "First!" }),
              makeFeedback({ id: 2, comment: "Second." }),
            ],
          },
          loading: false,
          error: null,
        }}
      />,
    );

    expect(screen.getByTestId("comment-list")).toBeInTheDocument();
    expect(
      screen.getAllByTestId("comment-item-comment").map((c) => c.textContent),
    ).toEqual(["First!", "Second."]);
  });
});
