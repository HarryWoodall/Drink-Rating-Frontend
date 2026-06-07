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
import { loginPath } from "@/lib/paths";
import type { RegisterFormValues } from "@/types/auth";
import { register as registerUser } from "./registerService";
import { authClient } from "@/lib/auth";

export function RegisterPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const { data: session } = authClient.useSession();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>();

  if (session) {
    navigate("/", { replace: true });
    return null;
  }

  async function onSubmit({ email, password }: RegisterFormValues) {
    setServerError(null);
    try {
      const { error } = await registerUser(email, password, "Name");

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
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link
            to="/"
            className="font-serif text-3xl italic font-semibold tracking-tight no-underline"
          >
            Night<span className="text-amber">cap</span>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-2xl italic">
              Create an account
            </CardTitle>
            <CardDescription>Join the Nightcap community</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-[0.1em] text-muted-foreground">
                  Email
                </label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Enter a valid email",
                    },
                  })}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-border bg-card/60 px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-amber"
                />
                {errors.email && (
                  <p className="text-xs text-red-400">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase tracking-[0.1em] text-muted-foreground">
                  Password
                </label>
                <input
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 4,
                      message: "At least 4 characters",
                    },
                  })}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-border bg-card/60 px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-amber"
                />
                {errors.password && (
                  <p className="text-xs text-red-400">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase tracking-[0.1em] text-muted-foreground">
                  Confirm password
                </label>
                <input
                  type="password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === watch("password") || "Passwords do not match",
                  })}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-border bg-card/60 px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-amber"
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-400">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

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
                Create account
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center">
            <p className="text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link to={loginPath()} className="text-amber hover:underline">
                Log in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
