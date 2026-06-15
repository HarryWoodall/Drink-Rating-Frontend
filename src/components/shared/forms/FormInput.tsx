import { cn } from "@/lib/utils";
import { forwardRef, InputHTMLAttributes } from "react";

import { Input } from "@/components/ui/input";

type FormInputProps = InputHTMLAttributes<HTMLInputElement>;

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  function EmailInput({ className, ...props }, ref) {
    return (
      <Input
        ref={ref}
        className={cn(
          "w-full rounded-xl border border-border bg-card/60 px-4 py-2 text-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-amber",
          className,
        )}
        {...props}
      />
    );
  },
);
