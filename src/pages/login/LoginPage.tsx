import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { registerPath } from "@/lib/paths";
import type { LoginFormValues } from "@/types/auth";
import { authClient } from "@/lib/auth";
import { signIn } from "./services/loginService";
import { PasswordInput } from "@/components/shared/forms/PasswordInput";
import { EmailInput } from "@/components/shared/forms/EmailInput";
import { Field, FieldLabel } from "@/components/ui/field";

export function LoginPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const { data: session } = authClient.useSession();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
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
    } catch (err) {}
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent px-4">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-5xl italic">
              Welcome back
            </CardTitle>
            <CardDescription className="text-lg">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Field>
                <FieldLabel
                  className="text-xs uppercase tracking-[0.1em] text-muted-foreground"
                  htmlFor="login-email-input"
                >
                  Email
                </FieldLabel>
                <EmailInput
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
                <p className="text-sm text-red-400 text-center">
                  {serverError}
                </p>
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

          <CardFooter className="justify-center">
            <p className="text-xs text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link to={registerPath()} className="text-amber hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
