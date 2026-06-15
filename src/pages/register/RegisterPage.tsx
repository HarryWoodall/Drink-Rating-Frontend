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
import { register as registerUser } from "./services/registerService";
import { authClient } from "@/lib/auth";
import { PasswordInput } from "@/components/shared/forms/PasswordInput";
import { FormInput } from "@/components/shared/forms/FormInput";
import { Field, FieldLabel } from "@/components/ui/field";
import { FormTextInput } from "@/components/shared/forms/FormTextInput";
import { Input } from "@/components/ui/input";

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

  async function onSubmit({ email, password, name }: RegisterFormValues) {
    setServerError(null);
    try {
      const { error } = await registerUser(email, password, name);

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
            <form
              onSubmit={handleSubmit(onSubmit)}
              autoComplete="off"
              className="space-y-4"
            >
              <FormTextInput
                label="Username"
                inputId="register-name-input"
                errors={errors.name}
              >
                <FormInput
                  id="register-name-input"
                  type="text"
                  {...register("name", {
                    required: "Name is required",
                  })}
                />
              </FormTextInput>

              <FormTextInput
                label="Email"
                inputId="register-email-input"
                errors={errors.email}
              >
                <FormInput
                  id="register-email-input"
                  placeholder="you@email.com"
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Enter a valid email",
                    },
                  })}
                />
              </FormTextInput>

              <FormTextInput
                label="Password"
                inputId="register-password-input"
                errors={errors.password}
              >
                <PasswordInput
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 4,
                      message: "At least 4 characters",
                    },
                  })}
                  placeholder={undefined}
                />
              </FormTextInput>

              <FormTextInput
                label="Confirm Password"
                inputId="register-password-confirm-input"
                errors={errors.confirmPassword}
              >
                <PasswordInput
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === watch("password") || "Passwords do not match",
                  })}
                  placeholder={undefined}
                />
              </FormTextInput>

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
