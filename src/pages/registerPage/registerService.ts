import { authClient } from "@/lib/auth";

export async function register(email: string, password: string, name: string) {
  return await authClient.signUp.email({
    email, // user email address
    password, // user password -> min 8 characters by default
    name, // user display name
    //   image, // User image URL (optional)
    callbackURL: "/", // A URL to redirect to after the user verifies their email (optional)
  });
}
