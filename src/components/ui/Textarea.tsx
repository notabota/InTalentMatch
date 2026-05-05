import React from "react";
import { cn } from "@/lib/cn";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
    { className, rows = 5, ...rest },
    ref,
) {
    return (
        <textarea
            ref={ref}
            rows={rows}
            className={cn(
                "w-full bg-white border border-border rounded-[var(--radius-input)] px-3.5 py-2.5",
                "outline-none text-text placeholder:text-text-muted resize-y",
                "focus:border-accent transition-colors",
                className,
            )}
            {...rest}
        />
    );
});

export default Textarea;
