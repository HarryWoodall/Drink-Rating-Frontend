import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import { ResetPasswordPage } from "./ResetPasswordPage";
import { resetPassword } from "./services/resetPasswordService";
import { authClient } from "@/lib/auth";
import { renderWithProviders } from "@/test/utils";

vi.mock("./services/resetPasswordService", () => ({ resetPassword: vi.fn() }));

vi.mock("@/lib/auth", () => ({ authClient: { signOut: vi.fn() } }));

type ResetResult = Awaited<ReturnType<typeof resetPassword>>;
type SignOutOptions = { fetchOptions: { onSuccess: () => void } };

function renderResetPage(route = "/reset-password?token=tok-123") {
  return renderWithProviders(
    <Routes>
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/login" element={<p data-testid="login-page" />} />
      <Route path="/404" element={<p data-testid="not-found-page" />} />
    </Routes>,
    { route },
  );
}

async function fillForm(password = "hunter22", confirm = password) {
  await userEvent.type(screen.getByTestId("reset-password-input"), password);
  await userEvent.type(
    screen.getByTestId("reset-password-confirm-input"),
    confirm,
  );
  await userEvent.click(screen.getByTestId("reset-password-submit"));
}

describe("ResetPasswordPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(resetPassword).mockResolvedValue({
      data: { status: true },
      error: null,
    } as ResetResult);
    vi.mocked(authClient.signOut).mockImplementation((async (
      options: SignOutOptions,
    ) => options.fetchOptions.onSuccess()) as never);
  });

  it("sends a visitor without a token to the 404 page", () => {
    renderResetPage("/reset-password");

    expect(screen.getByTestId("not-found-page")).toBeInTheDocument();
  });

  it("labels both password fields", () => {
    renderResetPage();

    expect(screen.getByTestId("form-page-title")).toHaveTextContent(
      "Reset Password",
    );
    expect(screen.getByTestId("reset-password-input")).toHaveAccessibleName(
      "Password",
    );
    expect(
      screen.getByTestId("reset-password-confirm-input"),
    ).toHaveAccessibleName("Confirm Password");
  });

  it("resets with the token from the link, then signs out to the login page", async () => {
    renderResetPage();

    await fillForm();

    expect(resetPassword).toHaveBeenCalledWith("hunter22", "tok-123");
    expect(authClient.signOut).toHaveBeenCalledOnce();
    expect(await screen.findByTestId("login-page")).toBeInTheDocument();
  });

  it("rejects mismatched passwords", async () => {
    renderResetPage();

    await fillForm("hunter22", "hunter23");

    expect(
      await screen.findByTestId("reset-password-confirm-input-error"),
    ).toHaveTextContent("Passwords do not match");
    expect(resetPassword).not.toHaveBeenCalled();
  });

  it("rejects a password under four characters", async () => {
    renderResetPage();

    await fillForm("abc");

    expect(
      await screen.findByTestId("reset-password-input-error"),
    ).toHaveTextContent("At least 4 characters");
    expect(resetPassword).not.toHaveBeenCalled();
  });

  it("shows the server's error and stays signed in", async () => {
    vi.mocked(resetPassword).mockResolvedValue({
      data: null,
      error: { message: "Token expired" },
    } as ResetResult);

    renderResetPage();
    await fillForm();

    expect(
      await screen.findByTestId("reset-password-server-error"),
    ).toHaveTextContent("Token expired");
    expect(authClient.signOut).not.toHaveBeenCalled();
  });

  it("shows the message when the reset throws", async () => {
    vi.mocked(resetPassword).mockRejectedValue(new Error("Network down"));

    renderResetPage();
    await fillForm();

    expect(
      await screen.findByTestId("reset-password-server-error"),
    ).toHaveTextContent("Network down");
  });
});
