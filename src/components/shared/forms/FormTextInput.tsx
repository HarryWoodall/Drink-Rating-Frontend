import { Field, FieldLabel } from "@/components/ui/field";
import { FieldError } from "react-hook-form";

interface TextInputProps {
  label: string;
  children: React.ReactNode;
  errors: FieldError | undefined;
  inputId?: string;
}

export function FormTextInput({
  label,
  inputId,
  children,
  errors,
}: TextInputProps) {
  // Keyed off the input so each field's label/error is uniquely addressable.
  const testId = inputId ?? "form-text-input";

  return (
    <Field className="py-0.5">
      <FieldLabel
        className="text-xs uppercase tracking-[0.1em] text-muted-foreground"
        htmlFor={inputId}
        data-testid={`${testId}-label`}
      >
        {label}
      </FieldLabel>
      {children}
      {errors && (
        <p className="text-xs text-red-400" data-testid={`${testId}-error`}>
          {errors.message}
        </p>
      )}
    </Field>
  );
}
