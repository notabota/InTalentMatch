import React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

export interface ChipProps {
    children: React.ReactNode;
    tone?: "outline" | "soft";
    onRemove?: () => void;
    className?: string;
}

export function Chip({ children, tone = "outline", onRemove, className }: ChipProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium",
                tone === "outline" ? "border border-border bg-white text-text" : "bg-primary-soft text-primary",
                className,
            )}
        >
            {children}
            {onRemove && (
                <button type="button" onClick={onRemove} aria-label="Remove" className="cursor-pointer">
                    <X className="h-3.5 w-3.5" />
                </button>
            )}
        </span>
    );
}

export default Chip;
