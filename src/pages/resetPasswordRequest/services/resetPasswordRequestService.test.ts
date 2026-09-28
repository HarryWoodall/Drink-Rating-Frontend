import { passwordResetRequest } from "./resetPasswordRequestService";
import { post } from "@/services/apiService";

vi.mock("@/services/apiService", () => ({ post: vi.fn() }));

describe("passwordResetRequest", () => {
  it("posts the email to the reset-password endpoint", async () => {
    vi.mocked(post).mockResolvedValue(undefined);

    await passwordResetRequest("user@example.test");

    expect(post).toHaveBeenCalledWith("/utils/auth/reset-password", {
      email: "user@example.test",
    });
  });
});
