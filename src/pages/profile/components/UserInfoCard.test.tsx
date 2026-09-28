import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { UserInfoCard } from "./UserInfoCard";
import { uploadProfileImage } from "../services/profileService";
import { authClient } from "@/lib/auth";
import { renderWithProviders } from "@/test/utils";
import { testUser } from "@/test/fixtures";

vi.mock("../services/profileService", () => ({ uploadProfileImage: vi.fn() }));

vi.mock("@/lib/auth", () => ({ authClient: { updateUser: vi.fn() } }));

vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

type UpdateUserResult = Awaited<ReturnType<typeof authClient.updateUser>>;

const avatar = new File(["png"], "avatar.png", { type: "image/png" });

async function startEditing() {
  await userEvent.click(screen.getByTestId("user-info-edit-button"));
  return screen.getByTestId("profile-name-input");
}

describe("UserInfoCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authClient.updateUser).mockResolvedValue({
      data: { status: true },
      error: null,
    } as UpdateUserResult);
    vi.mocked(uploadProfileImage).mockResolvedValue("img-123");
    URL.createObjectURL = vi.fn(() => "blob:preview");
  });

  it("shows the user's name, email and avatar", () => {
    renderWithProviders(<UserInfoCard user={testUser} />);

    expect(screen.getByTestId("user-info-name")).toHaveTextContent(
      testUser.name,
    );
    expect(screen.getByTestId("user-info-email")).toHaveTextContent(
      testUser.email,
    );
    expect(screen.getByTestId("user-avatar")).toBeInTheDocument();
    expect(screen.queryByTestId("profile-name-input")).not.toBeInTheDocument();
  });

  it("switches to an edit form pre-filled with the current name", async () => {
    renderWithProviders(<UserInfoCard user={testUser} />);

    const name = await startEditing();

    expect(name).toHaveValue(testUser.name);
    expect(screen.queryByTestId("user-info-name")).not.toBeInTheDocument();
  });

  it("disables saving until something changes", async () => {
    renderWithProviders(<UserInfoCard user={testUser} />);

    const name = await startEditing();
    expect(screen.getByTestId("profile-save-button")).toBeDisabled();

    await userEvent.type(name, "!");
    expect(screen.getByTestId("profile-save-button")).toBeEnabled();
  });

  it("saves a new name and returns to the read-only view", async () => {
    renderWithProviders(<UserInfoCard user={testUser} />);

    const name = await startEditing();
    await userEvent.clear(name);
    await userEvent.type(name, "Sam Taylor");
    await userEvent.click(screen.getByTestId("profile-save-button"));

    expect(authClient.updateUser).toHaveBeenCalledWith({ name: "Sam Taylor" });
    expect(uploadProfileImage).not.toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith("Profile updated");
    expect(await screen.findByTestId("user-info-name")).toBeInTheDocument();
  });

  it("requires a name", async () => {
    renderWithProviders(<UserInfoCard user={testUser} />);

    await userEvent.clear(await startEditing());
    await userEvent.click(screen.getByTestId("profile-save-button"));

    expect(
      await screen.findByTestId("profile-name-input-error"),
    ).toHaveTextContent("Name is required");
    expect(authClient.updateUser).not.toHaveBeenCalled();
  });

  it("previews and uploads a chosen profile image", async () => {
    renderWithProviders(<UserInfoCard user={testUser} />);
    await startEditing();

    expect(screen.getByTestId("profile-image-upload-button")).toHaveTextContent(
      "Upload image",
    );

    await userEvent.upload(screen.getByTestId("profile-image-file-input"), avatar);

    expect(screen.getByTestId("profile-image-preview")).toHaveAttribute(
      "src",
      "blob:preview",
    );
    expect(screen.getByTestId("profile-image-file-name")).toHaveTextContent(
      "avatar.png",
    );
    expect(screen.getByTestId("profile-image-upload-button")).toHaveTextContent(
      "Change image",
    );

    await userEvent.click(screen.getByTestId("profile-save-button"));

    expect(uploadProfileImage).toHaveBeenCalledWith(avatar);
    await waitFor(() => expect(authClient.updateUser).toHaveBeenCalled());
  });

  it("stops and toasts when the image upload fails", async () => {
    vi.mocked(uploadProfileImage).mockRejectedValue(new Error("413"));
    renderWithProviders(<UserInfoCard user={testUser} />);
    await startEditing();

    await userEvent.upload(screen.getByTestId("profile-image-file-input"), avatar);
    await userEvent.click(screen.getByTestId("profile-save-button"));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Failed to upload image"),
    );
    expect(authClient.updateUser).not.toHaveBeenCalled();
    expect(screen.getByTestId("profile-name-input")).toBeInTheDocument();
  });

  it("toasts the error and stays in edit mode when the update fails", async () => {
    vi.mocked(authClient.updateUser).mockResolvedValue({
      data: null,
      error: { message: "Name taken" },
    } as UpdateUserResult);
    renderWithProviders(<UserInfoCard user={testUser} />);

    await userEvent.type(await startEditing(), "!");
    await userEvent.click(screen.getByTestId("profile-save-button"));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Name taken"));
    expect(screen.getByTestId("profile-name-input")).toBeInTheDocument();
  });

  it("cancels back to the read-only view", async () => {
    renderWithProviders(<UserInfoCard user={testUser} />);
    await startEditing();

    await userEvent.click(screen.getByTestId("profile-cancel-button"));

    expect(screen.getByTestId("user-info-name")).toBeInTheDocument();
    expect(authClient.updateUser).not.toHaveBeenCalled();
  });
});
