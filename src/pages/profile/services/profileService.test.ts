import { fetchUserFeedback, uploadProfileImage } from "./profileService";
import { get, postWithFormData } from "@/services/apiService";

vi.mock("@/services/apiService", () => ({
  get: vi.fn(),
  postWithFormData: vi.fn(),
}));

describe("profileService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  it("fetchUserFeedback gets the signed-in user's feedback", async () => {
    vi.mocked(get).mockResolvedValue([]);

    await expect(fetchUserFeedback()).resolves.toEqual([]);
    expect(get).toHaveBeenCalledWith("/users/me/feedback");
  });

  it("uploadProfileImage posts the file as `image` and returns the new URL", async () => {
    vi.mocked(postWithFormData).mockResolvedValue({ imageUrl: "img-123" });
    const file = new File(["png"], "avatar.png", { type: "image/png" });

    await expect(uploadProfileImage(file)).resolves.toBe("img-123");

    const [path, formData] = vi.mocked(postWithFormData).mock.calls[0];
    expect(path).toBe("/users/me/profile/image");
    expect(formData.get("image")).toBe(file);
  });
});
