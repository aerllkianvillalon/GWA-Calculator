import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  hideLabel?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, hideLabel, id, className, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-2">
        <label
          htmlFor={selectId}
          className={cn("text-sm font-medium text-ink-700", hideLabel && "sr-only")}
        >
          {label}
        </label>
        <select
          ref={ref}
          id={selectId}
          className={cn(
            "w-full rounded-md border border-ink-100 bg-white px-3 py-2 text-sm text-ink-900",
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
);
Select.displayName = "Select";
