import { post } from "@/services/apiService";

export async function passwordResetRequest(email: string): Promise<void> {
  return post<void>(`/utils/auth/reset-password`, { email });
}
