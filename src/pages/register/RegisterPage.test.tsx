import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import { RegisterPage } from "./RegisterPage";
import { register } from "./services/registerService";
import { authClient } from "@/lib/auth";
import { renderWithProviders } from "@/test/utils";
import { sessionState } from "@/test/fixtures";

vi.mock("./services/registerService", () => ({ register: vi.fn() }));

vi.mock("@/lib/auth", () => ({ authClient: { useSession: vi.fn() } }));

type RegisterResult = Awaited<ReturnType<typeof register>>;

function renderRegisterPage() {
  return renderWithProviders(
    <Routes>
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<p data-testid="home-page" />} />
    </Routes>,
    { route: "/register" },
  );
}

type RegisterFields = {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
};

async function fillForm({
  name = "Alex",
  email = "user@example.test",
  password = "hunter22",
  confirm = password,
}: RegisterFields = {}) {
  await userEvent.type(screen.getByTestId("register-name-input"), name);
  await userEvent.type(screen.getByTestId("register-email-input"), email);
  await userEvent.type(screen.getByTestId("register-password-input"), password);
  await userEvent.type(
    screen.getByTestId("register-password-confirm-input"),
    confirm,
  );
  await userEvent.click(screen.getByTestId("register-submit"));
}

describe("RegisterPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authClient.useSession).mockReturnValue(sessionState(null));
    vi.mocked(register).mockResolvedValue({
      data: {},
      error: null,
    } as RegisterResult);
  });

  it("labels every field and links back to login", () => {
    renderRegisterPage();

    expect(screen.getByTestId("register-name-input")).toHaveAccessibleName(
      "Username",
    );
    expect(screen.getByTestId("register-email-input")).toHaveAccessibleName(
      "Email",
    );
    expect(screen.getByTestId("register-password-input")).toHaveAccessibleName(
      "Password",
    );
    expect(
      screen.getByTestId("register-password-confirm-input"),
    ).toHaveAccessibleName("Confirm Password");
    expect(screen.getByTestId("register-login-link")).toHaveAttribute(
      "href",
      "/login",
    );
  });

  it("registers with the entered details", async () => {
    renderRegisterPage();

    await fillForm();

    expect(register).toHaveBeenCalledWith("user@example.test", "hunter22", "Alex");
  });

  it("requires every field", async () => {
    renderRegisterPage();

    await userEvent.click(screen.getByTestId("register-submit"));

    expect(
      await screen.findByTestId("register-name-input-error"),
    ).toHaveTextContent("Name is required");
    expect(screen.getByTestId("register-email-input-error")).toHaveTextContent(
      "Email is required",
    );
    expect(
      screen.getByTestId("register-password-input-error"),
    ).toHaveTextContent("Password is required");
    expect(
      screen.getByTestId("register-password-confirm-input-error"),
    ).toHaveTextContent("Please confirm your password");
    expect(register).not.toHaveBeenCalled();
  });

  it("rejects an invalid email", async () => {
    renderRegisterPage();

    // Passes the browser's type="email" check, so it reaches our pattern rule.
    await fillForm({ email: "user@nowhere" });

    expect(
      await screen.findByTestId("register-email-input-error"),
    ).toHaveTextContent("Enter a valid email");
    expect(register).not.toHaveBeenCalled();
  });

  it("rejects a password under four characters", async () => {
    renderRegisterPage();

    await fillForm({ password: "abc" });

    expect(
      await screen.findByTestId("register-password-input-error"),
    ).toHaveTextContent("At least 4 characters");
    expect(register).not.toHaveBeenCalled();
  });

  it("rejects mismatched passwords", async () => {
    renderRegisterPage();

    await fillForm({ password: "hunter22", confirm: "hunter23" });

    expect(
      await screen.findByTestId("register-password-confirm-input-error"),
    ).toHaveTextContent("Passwords do not match");
    expect(register).not.toHaveBeenCalled();
  });

  it("shows the error the auth server returns", async () => {
    vi.mocked(register).mockResolvedValue({
      data: null,
      error: { message: "User already exists" },
    } as RegisterResult);

    renderRegisterPage();
    await fillForm();

    expect(
      await screen.findByTestId("register-server-error"),
    ).toHaveTextContent("User already exists");
  });

  it("shows the message when registration throws", async () => {
    vi.mocked(register).mockRejectedValue(new Error("Network down"));

    renderRegisterPage();
    await fillForm();

    expect(
      await screen.findByTestId("register-server-error"),
    ).toHaveTextContent("Network down");
  });

  it("sends an already signed-in user home", () => {
    vi.mocked(authClient.useSession).mockReturnValue(sessionState());

    renderRegisterPage();

    expect(screen.getByTestId("home-page")).toBeInTheDocument();
  });
});
