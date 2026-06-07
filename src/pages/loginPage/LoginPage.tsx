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
import { signIn } from "./loginService";

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
              Welcome back
            </CardTitle>
            <CardDescription>
              Sign in to your account to continue
            </CardDescription>
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
