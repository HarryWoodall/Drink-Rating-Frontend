import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { registerPath, resetPasswordRequest } from "@/lib/paths";
import type { LoginFormValues } from "@/types/auth";
import { authClient } from "@/lib/auth";
import { signIn } from "./services/loginService";
import { PasswordInput } from "@/components/shared/forms/PasswordInput";
import { FormInput } from "@/components/shared/forms/FormInput";
import { Field, FieldLabel } from "@/components/ui/field";
import { FormPage } from "@/components/shared/layouts/FormPage";

export function LoginPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const { data: session } = authClient.useSession();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginFormValues>();

  if (session) {
    navigate("/", { replace: true });
    return null;
  }

  async function onSubmit({ email, password }: LoginFormValues) {
    setServerError(null);
    try {
      const { error } = await signIn(email, password);

      if (error) {
        setServerError(error.message ? error.message : "Unknown Error");
      }
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Registration failed",
      );
    }
  }

  return (
    <FormPage
      title="Welcome back"
      description="Sign in to your account to continue"
    >
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Field>
            <FieldLabel
              className="text-xs uppercase tracking-[0.1em] text-muted-foreground"
              htmlFor="login-email-input"
            >
              Email
            </FieldLabel>
            <FormInput
              id="login-email-input"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Enter a valid email",
                },
              })}
            />
          </Field>

          <Field>
            <FieldLabel
              className="text-xs uppercase tracking-[0.1em] text-muted-foreground"
              htmlFor="login-password-input"
            >
              Password
            </FieldLabel>
            <PasswordInput
              id="login-password-input"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 4,
                  message: "At least 4 characters",
                },
              })}
              placeholder="password"
            />
          </Field>

          {serverError && (
            <p className="text-sm text-red-400 text-center">{serverError}</p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full"
          >
            {isSubmitting && (
              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
            )}
            Sign in
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center flex-col gap-2">
        <p className="text-xs text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link to={registerPath()} className="text-amber hover:underline">
            Sign up
          </Link>
        </p>

        <p className="text-xs text-muted-foreground">
          Forgot Password?{" "}
          <Link
            to={resetPasswordRequest()}
            className="text-amber hover:underline"
          >
            Reset password
          </Link>
        </p>
      </CardFooter>
    </FormPage>
  );
}
