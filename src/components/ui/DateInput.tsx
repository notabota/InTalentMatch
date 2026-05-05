import React from "react";
import { cn } from "@/lib/cn";

export type DateInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">;

export const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(function DateInput(
    { className, ...rest },
    ref,
) {
    return (
        <input
            ref={ref}
            type="date"
            className={cn(
                "w-full bg-white border border-border rounded-[var(--radius-input)] px-3.5 py-2.5",
                "outline-none text-text placeholder:text-text-muted focus:border-accent transition-colors",
                className,
            )}
            {...rest}
        />
    );
});

export default DateInput;
