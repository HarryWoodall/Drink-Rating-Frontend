import { resetPassword } from "./resetPasswordService";
import { authClient } from "@/lib/auth";

vi.mock("@/lib/auth", () => ({
  authClient: { resetPassword: vi.fn() },
}));

describe("resetPassword", () => {
  it("sends the new password with the emailed token", async () => {
    const result = { data: { status: true }, error: null };
    vi.mocked(authClient.resetPassword).mockResolvedValue(result as never);

    await expect(resetPassword("hunter22", "tok-123")).resolves.toBe(result);

    expect(authClient.resetPassword).toHaveBeenCalledWith({
      newPassword: "hunter22",
      token: "tok-123",
    });
  });
});
