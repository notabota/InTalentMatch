import React from "react";
import { cn } from "@/lib/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
    { leftIcon, rightIcon, className, ...rest },
    ref,
) {
    return (
        <div
            className={cn(
                "flex items-center gap-2 bg-white border border-border rounded-[var(--radius-input)] px-3.5 py-2.5",
                "focus-within:border-accent transition-colors",
                className,
            )}
        >
            {leftIcon && <span className="text-text-muted shrink-0">{leftIcon}</span>}
            <input
                ref={ref}
                className="flex-1 min-w-0 bg-transparent outline-none text-text placeholder:text-text-muted"
                {...rest}
            />
            {rightIcon && <span className="text-text-muted shrink-0">{rightIcon}</span>}
        </div>
    );
});

export default Input;
