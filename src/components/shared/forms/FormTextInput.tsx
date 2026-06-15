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
  return (
    <Field className="py-0.5">
      <FieldLabel
        className="text-xs uppercase tracking-[0.1em] text-muted-foreground"
        htmlFor={inputId}
      >
        {label}
      </FieldLabel>
      {children}
      {errors && <p className="text-xs text-red-400">{errors.message}</p>}
    </Field>
  );
}
