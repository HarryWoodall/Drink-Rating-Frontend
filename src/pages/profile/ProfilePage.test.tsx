import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import { ProfilePage } from "./ProfilePage";
import { fetchUserFeedback } from "./services/profileService";
import { authClient } from "@/lib/auth";
import { useRouteHistoryStore } from "@/store/routeHistoryStore";
import { renderWithProviders } from "@/test/utils";
import { sessionState, testUser } from "@/test/fixtures";

vi.mock("./services/profileService", () => ({
  fetchUserFeedback: vi.fn(),
  uploadProfileImage: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  authClient: { useSession: vi.fn(), updateUser: vi.fn() },
}));

function renderProfilePage() {
  return renderWithProviders(
    <Routes>
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/login" element={<p data-testid="login-page" />} />
      <Route
        path="/reset-password-request"
        element={<p data-testid="reset-password-request-page" />}
      />
    </Routes>,
    { route: "/profile" },
  );
}

describe("ProfilePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authClient.useSession).mockReturnValue(sessionState());
    vi.mocked(fetchUserFeedback).mockResolvedValue([]);
  });

  it("shows the signed-in user's details and feedback history", async () => {
    renderProfilePage();

    expect(screen.getByTestId("user-info-name")).toHaveTextContent(
      testUser.name,
    );
    expect(screen.getByTestId("user-info-email")).toHaveTextContent(
      testUser.email,
    );
    expect(
      await screen.findByTestId("feedback-history-empty"),
    ).toBeInTheDocument();
  });

  it("sends a signed-out visitor to the login page", () => {
    vi.mocked(authClient.useSession).mockReturnValue(sessionState(null));

    renderProfilePage();

    expect(screen.getByTestId("login-page")).toBeInTheDocument();
    expect(fetchUserFeedback).not.toHaveBeenCalled();
  });

  it("renders nothing while the session loads", () => {
    vi.mocked(authClient.useSession).mockReturnValue(
      sessionState(null, { pending: true }),
    );

    renderProfilePage();

    expect(screen.queryByTestId("profile-page")).not.toBeInTheDocument();
    expect(screen.queryByTestId("login-page")).not.toBeInTheDocument();
  });

  it("links to the password reset request", async () => {
    renderProfilePage();

    await userEvent.click(screen.getByTestId("profile-reset-password-button"));

    expect(
      screen.getByTestId("reset-password-request-page"),
    ).toBeInTheDocument();
  });

  it("registers itself for the next page's back link", () => {
    renderProfilePage();

    expect(useRouteHistoryStore.getState().currentBackText).toBe(
      "Back to profile",
    );
  });
});
