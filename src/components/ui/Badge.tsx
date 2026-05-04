import React from "react";
import { cn } from "@/lib/cn";

type Tone = "open" | "assigned" | "completed" | "overdue" | "premium" | "neutral";

const toneClasses: Record<Tone, string> = {
    open: "bg-success text-white",
    assigned: "bg-success text-white",
    completed: "bg-success text-white",
    overdue: "bg-danger text-white",
    premium: "bg-primary-soft text-primary",
    neutral: "bg-surface-muted text-text-muted",
};

export interface BadgeProps {
    tone?: Tone;
    children: React.ReactNode;
    className?: string;
}

export function Badge({ tone = "neutral", children, className }: BadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
                toneClasses[tone],
                className,
            )}
        >
            {children}
        </span>
    );
}

export default Badge;
