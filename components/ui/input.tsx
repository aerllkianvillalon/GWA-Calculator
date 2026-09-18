import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hideLabel?: boolean;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hideLabel, hint, id, className, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

    return (
      <div className="flex flex-col gap-2">
        <label
          htmlFor={inputId}
          className={cn("text-sm font-medium text-ink-700", hideLabel && "sr-only")}
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={
            [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") || undefined
          }
          className={cn(
            "w-full rounded-md border bg-white px-3 py-2 text-sm text-ink-900",
            "placeholder:text-ink-300",
            error ? "border-danger-600" : "border-ink-100",
            className
          )}
          {...props}
        />
        {hint && !error && (
          <p id={hintId} className="text-xs text-ink-500">
            {hint}
          </p>
        )}
        {error && (
          <p id={errorId} role="alert" className="text-xs font-medium text-danger-600">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
