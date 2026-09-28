import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreateFeedbackModal } from "./CreateFeedbackModal";
import { postFeedback } from "@/pages/drink/services/drinkService";
import { HttpError } from "@/lib/errors";
import { renderWithProviders } from "@/test/utils";

vi.mock("@/pages/drink/services/drinkService", () => ({
  postFeedback: vi.fn(),
}));

vi.mock("sonner", () => ({ toast: { error: vi.fn() } }));

async function openModal() {
  await userEvent.click(screen.getByTestId("create-feedback-trigger"));
  return screen.findByTestId("feedback-modal");
}

function filledStars() {
  return screen
    .getAllByTestId(/^feedback-modal-star-\d$/)
    .filter((star) => star.dataset.filled === "true");
}

describe("CreateFeedbackModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(postFeedback).mockResolvedValue();
  });

  it("opens an empty review dialog", async () => {
    renderWithProviders(<CreateFeedbackModal drinkId="11007" />);

    expect(screen.getByTestId("create-feedback-trigger")).toHaveTextContent(
      "Rate & Review",
    );

    await openModal();

    expect(screen.getByTestId("feedback-modal-title")).toHaveTextContent(
      "Leave your verdict",
    );
    expect(screen.getByTestId("feedback-modal-comment")).toHaveValue("");
    expect(filledStars()).toHaveLength(0);
  });

  it("labels each star for screen readers", async () => {
    renderWithProviders(<CreateFeedbackModal drinkId="11007" />);
    await openModal();

    expect(screen.getByTestId("feedback-modal-star-1")).toHaveAccessibleName(
      "Rate 1 star",
    );
    expect(screen.getByTestId("feedback-modal-star-4")).toHaveAccessibleName(
      "Rate 4 stars",
    );
  });

  it("posts the rating and comment, then closes", async () => {
    renderWithProviders(<CreateFeedbackModal drinkId="11007" />);
    await openModal();

    await userEvent.click(screen.getByTestId("feedback-modal-star-4"));
    await userEvent.type(
      screen.getByTestId("feedback-modal-comment"),
      "Bright and zesty",
    );
    await userEvent.click(screen.getByTestId("feedback-modal-submit"));

    expect(postFeedback).toHaveBeenCalledWith("11007", "Bright and zesty", 4);
    await waitFor(() =>
      expect(screen.queryByTestId("feedback-modal")).not.toBeInTheDocument(),
    );
  });

  it("counts characters as you type", async () => {
    renderWithProviders(<CreateFeedbackModal drinkId="11007" />);
    await openModal();

    await userEvent.type(screen.getByTestId("feedback-modal-comment"), "Tart");

    expect(screen.getByTestId("feedback-modal-char-count")).toHaveTextContent(
      "4/500",
    );
  });

  it("previews the rating under the cursor", async () => {
    renderWithProviders(<CreateFeedbackModal drinkId="11007" />);
    await openModal();

    await userEvent.hover(screen.getByTestId("feedback-modal-star-3"));

    expect(filledStars()).toHaveLength(3);
  });

  it("rejects a comment shorter than three characters", async () => {
    renderWithProviders(<CreateFeedbackModal drinkId="11007" />);
    await openModal();

    await userEvent.click(screen.getByTestId("feedback-modal-star-5"));
    await userEvent.type(screen.getByTestId("feedback-modal-comment"), "ok");
    await userEvent.click(screen.getByTestId("feedback-modal-submit"));

    expect(
      await screen.findByTestId("feedback-modal-comment-error"),
    ).toHaveTextContent("Must be at least 3 characters");
    expect(postFeedback).not.toHaveBeenCalled();
  });

  it("keeps the dialog open and shows the error when posting fails", async () => {
    vi.mocked(postFeedback).mockRejectedValue(
      new HttpError(400, "Bad Request", { message: "Nope" }, new Response()),
    );
    renderWithProviders(<CreateFeedbackModal drinkId="11007" />);
    await openModal();

    await userEvent.click(screen.getByTestId("feedback-modal-star-2"));
    await userEvent.type(
      screen.getByTestId("feedback-modal-comment"),
      "Too sweet",
    );
    await userEvent.click(screen.getByTestId("feedback-modal-submit"));

    expect(
      await screen.findByTestId("feedback-modal-server-error"),
    ).toHaveTextContent("Nope");
    expect(screen.getByTestId("feedback-modal")).toBeInTheDocument();
  });

  it("clears the draft when the dialog is dismissed", async () => {
    renderWithProviders(<CreateFeedbackModal drinkId="11007" />);
    await openModal();

    await userEvent.type(
      screen.getByTestId("feedback-modal-comment"),
      "Half a thought",
    );
    await userEvent.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByTestId("feedback-modal")).not.toBeInTheDocument(),
    );

    await openModal();
    expect(screen.getByTestId("feedback-modal-comment")).toHaveValue("");
  });
});
