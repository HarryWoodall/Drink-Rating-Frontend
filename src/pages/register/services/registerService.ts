import { authClient } from "@/lib/auth";

export async function register(email: string, password: string, name: string) {
  return await authClient.signUp.email({
    email,
    password,
    name,
    //   image,
    callbackURL: "/",
  });
}
