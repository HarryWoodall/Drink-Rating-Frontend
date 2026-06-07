import { authClient } from "@/lib/auth"; //import the auth client

export async function signIn(email: string, password: string) {
  return await authClient.signIn.email(
    {
      email,
      password,
      callbackURL: "/",
      rememberMe: true,
    },
    {},
  );
}
