import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { RegisterFormValues, ResetPasswordFormValues } from "@/types/auth";
import { authClient } from "@/lib/auth";
import { PasswordInput } from "@/components/shared/forms/PasswordInput";
import { FormTextInput } from "@/components/shared/forms/FormTextInput";
import { resetPassword } from "./services/resetPasswordService";
import { FormPage } from "@/components/shared/layouts/FormPage";

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>();

  if (token === null) {
    navigate("/404", { replace: true });
    return null;
  }

  async function onSubmit({ password }: ResetPasswordFormValues) {
    setServerError(null);
    try {
      const { error } = await resetPassword(
        password,
        searchParams.get("token")!,
      );

      if (error) {
        setServerError(error.message ? error.message : "Unknown Error");
        return;
      }

      authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            navigate("/login");
          },
        },
      });
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Reset Password failed",
      );
    }
  }

  return (
    <FormPage title="Reset Password">
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
          className="space-y-4"
        >
          <FormTextInput
            label="Password"
            inputId="reset-password-input"
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
            inputId="reset-password-confirm-input"
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
            Reset Password
          </Button>
        </form>
      </CardContent>
    </FormPage>
  );
}
