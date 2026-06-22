import { authClient } from "@/lib/auth";

export async function resetPassword(password: string, token: string) {
  return await authClient.resetPassword({
    newPassword: password,
    token,
  });
}
