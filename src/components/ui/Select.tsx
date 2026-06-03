import React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    options: { value: string; label: string }[];
    placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(function Select(
    { options, placeholder, className, ...rest },
    ref,
) {
    return (
        <div className={cn("relative inline-flex items-center", className)}>
            <select
                ref={ref}
                className="appearance-none bg-surface-muted border border-border rounded-full pl-4 pr-9 py-2 text-sm font-medium text-text outline-none cursor-pointer focus:border-accent"
                {...rest}
            >
                {placeholder && <option value="">{placeholder}</option>}
                {options.map((o) => (
                    <option key={o.value} value={o.value}>
                        {o.label}
                    </option>
                ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-accent" />
        </div>
    );
});

export default Select;
