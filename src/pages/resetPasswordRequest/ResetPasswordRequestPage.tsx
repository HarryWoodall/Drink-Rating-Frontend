import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ResetPasswordRequestFormValues } from "@/types/auth";
import { FormTextInput } from "@/components/shared/forms/FormTextInput";
import { passwordResetRequest } from "./services/resetPasswordRequestService";
import { FormPage } from "@/components/shared/layouts/FormPage";
import { FormInput } from "@/components/shared/forms/FormInput";
import { HttpError } from "@/lib/errors";

export function ResetPasswordRequestPage() {
  // const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successState, setSuccessState] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordRequestFormValues>();

  async function onSubmit({ email }: ResetPasswordRequestFormValues) {
    setServerError(null);
    setSuccessState(null);
    try {
      await passwordResetRequest(email);
      setSuccessState("An email will be sent to you with a reset link");
    } catch (err) {
      if (err instanceof HttpError && err.status == 429) {
        setServerError(
          `Please wait ${err.body.cooldown.seconds} seconds before trying again`,
        );
        return;
      }

      setServerError(
        err instanceof Error ? err.message : "Reset Password failed",
      );
    }
  }

  return (
    <FormPage
      title="Reset Password"
      description="An email will be sent to this email with a link to reset your password"
    >
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
          className="space-y-4"
        >
          <FormTextInput
            label="Enter your email address"
            inputId="reset-password-email-input"
            errors={errors.email}
          >
            <FormInput
              id="reset-password-email-input"
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

          {serverError && (
            <p className="text-sm text-red-400 text-center">{serverError}</p>
          )}

          {successState && (
            <p className="text-sm text-emerald-400 text-center">
              {successState}
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
            Reset Password
          </Button>
        </form>
      </CardContent>
    </FormPage>
  );
}
