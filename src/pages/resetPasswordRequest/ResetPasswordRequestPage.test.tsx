import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ResetPasswordRequestPage } from "./ResetPasswordRequestPage";
import { passwordResetRequest } from "./services/resetPasswordRequestService";
import { HttpError } from "@/lib/errors";
import { renderWithProviders } from "@/test/utils";

vi.mock("./services/resetPasswordRequestService", () => ({
  passwordResetRequest: vi.fn(),
}));

async function requestReset(email: string) {
  await userEvent.type(screen.getByTestId("reset-password-email-input"), email);
  await userEvent.click(screen.getByTestId("reset-password-request-submit"));
}

describe("ResetPasswordRequestPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(passwordResetRequest).mockResolvedValue();
  });

  it("explains what the form does", () => {
    renderWithProviders(<ResetPasswordRequestPage />);

    expect(screen.getByTestId("form-page-title")).toHaveTextContent(
      "Reset Password",
    );
    expect(screen.getByTestId("form-page-description")).toHaveTextContent(
      "link to reset your password",
    );
    expect(
      screen.getByTestId("reset-password-email-input"),
    ).toHaveAccessibleName("Enter your email address");
  });

  it("requests a reset link and confirms it's on the way", async () => {
    renderWithProviders(<ResetPasswordRequestPage />);

    await requestReset("user@example.test");

    expect(passwordResetRequest).toHaveBeenCalledWith("user@example.test");
    expect(
      await screen.findByTestId("reset-password-request-success"),
    ).toHaveTextContent("An email will be sent to you with a reset link");
  });

  it("requires a valid email", async () => {
    renderWithProviders(<ResetPasswordRequestPage />);

    // Passes the browser's type="email" check, so it reaches our pattern rule.
    await requestReset("user@nowhere");

    expect(
      await screen.findByTestId("reset-password-email-input-error"),
    ).toHaveTextContent("Enter a valid email");
    expect(passwordResetRequest).not.toHaveBeenCalled();
  });

  it("tells a rate-limited user how long to wait", async () => {
    vi.mocked(passwordResetRequest).mockRejectedValue(
      new HttpError(
        429,
        "Too Many Requests",
        { error: "slow down", cooldown: { minutes: 0, seconds: 45 } },
        new Response(),
      ),
    );

    renderWithProviders(<ResetPasswordRequestPage />);
    await requestReset("user@example.test");

    expect(
      await screen.findByTestId("reset-password-request-error"),
    ).toHaveTextContent("Please wait 45 seconds before trying again");
  });

  it("shows other failures' messages", async () => {
    vi.mocked(passwordResetRequest).mockRejectedValue(
      new Error("Network down"),
    );

    renderWithProviders(<ResetPasswordRequestPage />);
    await requestReset("user@example.test");

    expect(
      await screen.findByTestId("reset-password-request-error"),
    ).toHaveTextContent("Network down");
    expect(
      screen.queryByTestId("reset-password-request-success"),
    ).not.toBeInTheDocument();
  });
});
