import { post } from "@/services/api";

export async function passwordResetRequest(email: string): Promise<void> {
  return post<void>(`/utils/auth/reset-password`, { email });
}