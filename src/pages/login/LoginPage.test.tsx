import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import { LoginPage } from "./LoginPage";
import { signIn } from "./services/loginService";
import { authClient } from "@/lib/auth";
import { renderWithProviders } from "@/test/utils";
import { sessionState } from "@/test/fixtures";

vi.mock("./services/loginService", () => ({ signIn: vi.fn() }));

vi.mock("@/lib/auth", () => ({ authClient: { useSession: vi.fn() } }));

type SignInResult = Awaited<ReturnType<typeof signIn>>;

function renderLoginPage() {
  return renderWithProviders(
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<p data-testid="home-page" />} />
    </Routes>,
    { route: "/login" },
  );
}

async function submit(email: string, password: string) {
  await userEvent.type(screen.getByTestId("login-email-input"), email);
  await userEvent.type(screen.getByTestId("login-password-input"), password);
  await userEvent.click(screen.getByTestId("login-submit"));
}

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authClient.useSession).mockReturnValue(sessionState(null));
    vi.mocked(signIn).mockResolvedValue({
      data: {},
      error: null,
    } as SignInResult);
  });

  it("renders the sign-in form with links to sign up and reset", () => {
    renderLoginPage();

    expect(screen.getByTestId("form-page-title")).toHaveTextContent(
      "Welcome back",
    );
    expect(screen.getByTestId("login-email-input")).toHaveAccessibleName(
      "Email",
    );
    expect(screen.getByTestId("login-password-input")).toHaveAccessibleName(
      "Password",
    );
    expect(screen.getByTestId("login-register-link")).toHaveAttribute(
      "href",
      "/register",
    );
    expect(screen.getByTestId("login-reset-link")).toHaveAttribute(
      "href",
      "/reset-password-request",
    );
  });

  it("signs in with the entered credentials", async () => {
    renderLoginPage();

    await submit("user@example.test", "hunter22");

    expect(signIn).toHaveBeenCalledWith("user@example.test", "hunter22");
    expect(screen.queryByTestId("login-server-error")).not.toBeInTheDocument();
  });

  it("doesn't submit an invalid email or short password", async () => {
    renderLoginPage();

    await submit("not-an-email", "abc");

    expect(signIn).not.toHaveBeenCalled();
  });

  it("shows the error the auth server returns", async () => {
    vi.mocked(signIn).mockResolvedValue({
      data: null,
      error: { message: "Invalid email or password" },
    } as SignInResult);

    renderLoginPage();
    await submit("user@example.test", "wrongpass");

    expect(await screen.findByTestId("login-server-error")).toHaveTextContent(
      "Invalid email or password",
    );
  });

  it("falls back to a generic message when the error has none", async () => {
    vi.mocked(signIn).mockResolvedValue({
      data: null,
      error: {},
    } as SignInResult);

    renderLoginPage();
    await submit("user@example.test", "wrongpass");

    expect(await screen.findByTestId("login-server-error")).toHaveTextContent(
      "Unknown Error",
    );
  });

  it("shows the message when sign-in throws", async () => {
    vi.mocked(signIn).mockRejectedValue(new Error("Network down"));

    renderLoginPage();
    await submit("user@example.test", "hunter22");

    expect(await screen.findByTestId("login-server-error")).toHaveTextContent(
      "Network down",
    );
  });

  it("sends an already signed-in user home", () => {
    vi.mocked(authClient.useSession).mockReturnValue(sessionState());

    renderLoginPage();

    expect(screen.getByTestId("home-page")).toBeInTheDocument();
    expect(screen.queryByTestId("login-submit")).not.toBeInTheDocument();
  });
});
