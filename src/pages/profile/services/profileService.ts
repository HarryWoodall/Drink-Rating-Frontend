import { get, postWithFormData } from "@/services/apiService";
import { UserFeedbackItem } from "@/types/auth";

export async function fetchUserFeedback(): Promise<UserFeedbackItem[]> {
  return get<UserFeedbackItem[]>("/users/me/feedback");
}

export async function uploadProfileImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  console.log(formData);

  const data = await postWithFormData<{ imageUrl: string }>(
    "/users/me/profile/image",
    formData,
  );

  return data.imageUrl;
}
