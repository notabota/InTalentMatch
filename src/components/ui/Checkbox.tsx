import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
    label?: React.ReactNode;
    description?: React.ReactNode;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
    { label, description, className, checked, ...rest },
    ref,
) {
    return (
        <label className={cn("flex items-start gap-3 cursor-pointer", className)}>
            <span className="relative inline-flex h-5 w-5 shrink-0 mt-0.5">
                <input ref={ref} type="checkbox" checked={checked} className="peer sr-only" {...rest} />
                <span className="h-5 w-5 rounded border border-border bg-white peer-checked:bg-accent peer-checked:border-accent transition-colors" />
                {checked && <Check className="absolute inset-0 m-auto h-3.5 w-3.5 text-white" strokeWidth={3} />}
            </span>
            {(label || description) && (
                <span>
                    {label && <span className="block font-medium text-text">{label}</span>}
                    {description && <span className="block text-sm text-text-muted">{description}</span>}
                </span>
            )}
        </label>
    );
});

export default Checkbox;
