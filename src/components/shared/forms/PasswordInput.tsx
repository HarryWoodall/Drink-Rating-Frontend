import { cn } from "@/lib/utils";
import { forwardRef, InputHTMLAttributes, useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { EyeIcon, EyeOffIcon } from "lucide-react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const PasswordInput = forwardRef<HTMLInputElement, InputProps>(
  function PasswordInput({ className, ...props }, ref) {
    const [visible, setVisible] = useState(false);

    return (
      <InputGroup className="w-full rounded-xl border border-border bg-card/60 dark:bg-card/60 px-2 py-5 focus:ring-1">
        <InputGroupInput
          type={visible ? "text" : "password"}
          autoComplete="new-password"
          placeholder="Enter password"
          ref={ref}
          className={cn(
            "px-2 py-3 text-sm placeholder:text-muted-foreground",
            className,
          )}
          {...props}
        />
        <InputGroupAddon align="inline-end">
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide password" : "Show password"}
            className="text-muted-foreground"
          >
            {visible ? (
              <EyeOffIcon className="h-4 w-4" />
            ) : (
              <EyeIcon className="h-4 w-4" />
            )}
          </button>
        </InputGroupAddon>
      </InputGroup>
    );
  },
);
