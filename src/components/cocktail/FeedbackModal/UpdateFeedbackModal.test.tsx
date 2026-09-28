import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UpdateFeedbackModal } from "./UpdateFeedbackModal";
import { putFeedback } from "@/pages/drink/services/drinkService";
import { renderWithProviders } from "@/test/utils";

vi.mock("@/pages/drink/services/drinkService", () => ({
  putFeedback: vi.fn(),
}));

vi.mock("sonner", () => ({ toast: { error: vi.fn() } }));

const currentState = { comment: "Solid classic.", rating: 3 };

describe("UpdateFeedbackModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(putFeedback).mockResolvedValue();
  });

  it("opens pre-filled with the existing review", async () => {
    renderWithProviders(
      <UpdateFeedbackModal
        drinkId="11007"
        feedbackId={42}
        currentState={currentState}
      />,
    );

    await userEvent.click(screen.getByTestId("update-feedback-trigger"));

    expect(await screen.findByTestId("feedback-modal-comment")).toHaveValue(
      "Solid classic.",
    );
    const filled = screen
      .getAllByTestId(/^feedback-modal-star-\d$/)
      .filter((star) => star.dataset.filled === "true");
    expect(filled).toHaveLength(3);
  });

  it("puts the edited review against the existing feedback id", async () => {
    renderWithProviders(
      <UpdateFeedbackModal
        drinkId="11007"
        feedbackId={42}
        currentState={currentState}
      />,
    );
    await userEvent.click(screen.getByTestId("update-feedback-trigger"));

    const comment = await screen.findByTestId("feedback-modal-comment");
    await userEvent.clear(comment);
    await userEvent.type(comment, "Better than I remembered.");
    await userEvent.click(screen.getByTestId("feedback-modal-star-5"));
    await userEvent.click(screen.getByTestId("feedback-modal-submit"));

    expect(putFeedback).toHaveBeenCalledWith(
      "11007",
      42,
      "Better than I remembered.",
      5,
    );
    await waitFor(() =>
      expect(screen.queryByTestId("feedback-modal")).not.toBeInTheDocument(),
    );
  });

  it("uses a compact icon trigger in the inline variant", async () => {
    renderWithProviders(
      <UpdateFeedbackModal
        drinkId="11007"
        feedbackId={42}
        currentState={currentState}
        variant="inline"
      />,
    );

    expect(
      screen.queryByTestId("update-feedback-trigger"),
    ).not.toBeInTheDocument();

    await userEvent.click(screen.getByTestId("update-feedback-trigger-inline"));

    expect(await screen.findByTestId("feedback-modal")).toBeInTheDocument();
  });
});
