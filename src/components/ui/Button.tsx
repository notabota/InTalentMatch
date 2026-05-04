import React from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "outline" | "ghost" | "link" | "danger";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
    primary: "bg-primary text-white hover:bg-primary-hover shadow-card",
    outline: "bg-white text-text border border-border hover:bg-surface-muted",
    ghost: "bg-transparent text-text hover:bg-surface-muted",
    link: "bg-transparent text-accent hover:text-accent-hover underline-offset-2 hover:underline px-0 py-0 shadow-none",
    danger: "bg-danger text-white hover:opacity-90 shadow-card",
};

const sizeClasses: Record<Size, string> = {
    sm: "text-sm px-3 py-1.5",
    md: "text-base px-5 py-2.5",
    lg: "text-lg px-7 py-3",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    size?: Size;
    pill?: boolean;
    fullWidth?: boolean;
}

export function Button({
    variant = "primary",
    size = "md",
    pill = false,
    fullWidth = false,
    className,
    type = "button",
    children,
    disabled,
    ...rest
}: ButtonProps) {
    return (
        <button
            type={type}
            disabled={disabled}
            className={cn(
                "inline-flex items-center justify-center gap-2 font-semibold transition-colors cursor-pointer",
                pill ? "rounded-full" : "rounded-lg",
                fullWidth && "w-full",
                variantClasses[variant],
                sizeClasses[size],
                disabled && "opacity-50 cursor-not-allowed pointer-events-none",
                className,
            )}
            {...rest}
        >
            {children}
        </button>
    );
}

export default Button;
